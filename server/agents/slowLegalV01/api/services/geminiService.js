import axios from 'axios';
import { checkForDuplicates, addToManualData } from './manualDataService.js';
import { generateHybridEmbedding } from './embeddingService.js';

/**
 * Determines if the query is within the legal scope by asking Gemini.
 * The prompt asks for a simple "yes" or "no" answer.
 */
export const isQueryInScope = async (query) => {
  try {
    const prompt = `Is the following legal question related to Indian advocacy and its legal domains (e.g., intellectual property, consumer protection, constitutional law, etc.)? Answer only "yes" or "no": "${query}"`;
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
    const response = await axios.post(process.env.GEMINI_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    if (
      !response.data ||
      !response.data.candidates ||
      !response.data.candidates[0] ||
      !response.data.candidates[0].content ||
      !response.data.candidates[0].content.parts ||
      !response.data.candidates[0].content.parts[0] ||
      !response.data.candidates[0].content.parts[0].text
    ) {
      console.error("Invalid response structure in isQueryInScope:", response.data);
      return false;
    }
    
    const answer = response.data.candidates[0].content.parts[0].text.trim().toLowerCase();
    console.log("isQueryInScope answer:", answer);
    return answer.startsWith("yes");
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit reached in isQueryInScope (429). Defaulting to true.");
      return true; // If rate limited, assume it's in scope
    }
    console.error("Error in isQueryInScope:", error.message);
    return false;
  }
};

// --- (The rest of your existing Gemini service functions remain unchanged) ---

//
// Preprocess Input: Normalize the query locally (without calling Gemini)
//
export const preprocessInput = async (query) => {
  try {
    console.log("Locally normalizing query:", query);
    let normalized = query.toLowerCase().replace(/[^\w\s]/g, "").trim();
    console.log("Normalized query:", normalized);
    return normalized;
  } catch (error) {
    console.error("Error normalizing query locally:", error.message);
    return query;
  }
};

//
// Generate legal answer using Gemini
//
export const getGeminiResponse = async (query) => {
  try {
    const prompt = `Answer the following legal question in a clear and concise manner: "${query}"`;
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
    const response = await axios.post(process.env.GEMINI_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    if (
      !response.data ||
      !response.data.candidates ||
      !response.data.candidates[0] ||
      !response.data.candidates[0].content ||
      !response.data.candidates[0].content.parts ||
      !response.data.candidates[0].content.parts[0] ||
      !response.data.candidates[0].content.parts[0].text
    ) {
      console.error("Invalid response structure in getGeminiResponse:", response.data);
      throw new Error("Invalid response from Gemini API in getGeminiResponse");
    }
    
    const answer = response.data.candidates[0].content.parts[0].text.trim();
    return { answer, accuracy: 100, source: 'Gemini API' };
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit reached in getGeminiResponse (429). Falling back.");
      return { answer: 'Sorry, no answer found at the moment due to rate limiting.', accuracy: 0 };
    }
    console.error('Error fetching response from Gemini:', error.message);
    return { answer: 'Sorry, no answer found at the moment.', accuracy: 0 };
  }
};

//
// Handle new query: store it if not duplicate.
//
export const handleNewQuery = async (query, answer) => {
  if (await checkForDuplicates(query)) return;
  const newEntry = {
    id: new Date().getTime().toString(),
    query,
    answer,
    category: 'uncategorized',
    keywords: [],
    embedding: await generateHybridEmbedding(query)
  };
  await addToManualData(newEntry);
  console.log(`New query added: ${query}`);
};
