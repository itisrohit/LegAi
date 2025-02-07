import { storeEmbeddingInDB } from '../services/embeddingService.js';
import { searchMongoDBForQuery } from '../services/mongodbService.js';
import { preprocessInput, getGeminiResponse, handleNewQuery, isQueryInScope } from '../services/geminiService.js';

export const handleQuery = async (req, reply) => {
  try {
    let { query } = req.body;
    
    // Locally normalize the query
    query = await preprocessInput(query);
    console.log("Normalized query:", query);
    
    // Use Gemini to check if the query is within your legal scope.
    const inScope = await isQueryInScope(query);
    if (!inScope) {
      return reply.send({ answer: "Sorry, ask something legal related." });
    }
    
    // Check if the query exists in MongoDB
    const results = await searchMongoDBForQuery(query);
    if (results && results.length > 0) {
      const bestAnswer = results[0].answer;
      return reply.send({ answer: bestAnswer });
    }
    
    // Generate answer using Gemini
    const geminiResponse = await getGeminiResponse(query);
    const { answer, accuracy } = geminiResponse;
    
    // Store new query-answer pair (locally and in MongoDB)
    await handleNewQuery(query, answer);
    await storeEmbeddingInDB(query, answer);
    
    reply.send({ answer, accuracy });
  } catch (error) {
    console.error("Error in queryController:", error);
    reply.code(500).send({ answer: "Internal server error." });
  }
};
