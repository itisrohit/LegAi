import fs from 'fs';
import natural from 'natural';
import axios from 'axios';
import { insertEmbedding } from './mongodbService.js';

//
// Gemini Embedding Method
//
export const generateGeminiEmbedding = async (text) => {
  try {
    console.log('Generating Gemini embedding for text:', text);
    
    const prompt = `Generate a numeric vector embedding for the following text as comma-separated numbers: "${text}"`;
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
    
    console.log('Making API request with payload:', JSON.stringify(payload, null, 2));
    console.log('Using API URL:', process.env.GEMINI_API_URL);
    
    const response = await axios.post(process.env.GEMINI_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('Raw API response:', JSON.stringify(response.data, null, 2));
    
    if (
      !response.data ||
      !response.data.candidates ||
      !response.data.candidates[0] ||
      !response.data.candidates[0].content ||
      !response.data.candidates[0].content.parts ||
      !response.data.candidates[0].content.parts[0] ||
      !response.data.candidates[0].content.parts[0].text
    ) {
      console.error('Invalid response structure:', response.data);
      throw new Error("Invalid response from Gemini API in generateGeminiEmbedding");
    }
    
    const output = response.data.candidates[0].content.parts[0].text.trim();
    console.log('Extracted Gemini output:', output);
    
    // Extract numeric values using regex
    const matches = output.match(/-?\d+(\.\d+)?/g);
    if (!matches || matches.length === 0) {
      console.warn("No numeric values extracted from Gemini API; returning empty array.");
      return [];
    }
    
    let geminiVector = matches.map(num => parseFloat(num.trim()));
    
    // Remove extraneous indicator (e.g., a leading '768') if present
    if (geminiVector.length > 10 && geminiVector[0] === 768) {
      console.log("Detected extraneous dimension indicator. Removing first element.");
      geminiVector.shift();
    }
    
    console.log('Gemini vector:', geminiVector);
    return geminiVector;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Gemini embedding rate limit reached (429). Falling back.');
      // Return empty array so the hybrid function will use only bag-of-words
      return [];
    }
    console.error('Error generating Gemini embedding:', error.message);
    console.error('Full error object:', error);
    return [];
  }
};

//
// Bag-of-Words Embedding Method using Natural
//
const buildVocabulary = () => {
  let vocabSet = new Set();
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync('api/data/manualData.json', 'utf-8'));
  } catch (error) {
    console.warn("manualData.json not found or empty. Using empty corpus.");
  }
  data.forEach(item => {
    const tokens = new natural.WordTokenizer().tokenize(item.query.toLowerCase());
    tokens.forEach(token => vocabSet.add(token));
  });
  if (vocabSet.size === 0) {
    const sampleTokens = new natural.WordTokenizer().tokenize("what is legal law in india".toLowerCase());
    sampleTokens.forEach(token => vocabSet.add(token));
  }
  return Array.from(vocabSet);
};

const generateBOWEmbedding = (text) => {
  console.log("Generating bag-of-words embedding for text:", text);
  const vocab = buildVocabulary();
  console.log("Vocabulary:", vocab);
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  let freqMap = {};
  tokens.forEach(token => {
    freqMap[token] = (freqMap[token] || 0) + 1;
  });
  
  const bowVector = vocab.map(term => freqMap[term] || 0);
  console.log("Bag-of-words vector:", bowVector);
  return bowVector;
};

//
// Hybrid Embedding: Combine Gemini and Bag-of-Words
//
export const generateHybridEmbedding = async (text) => {
  const geminiVector = await generateGeminiEmbedding(text);
  const bowVector = generateBOWEmbedding(text);
  
  const validGeminiCount = geminiVector.filter(x => !isNaN(x)).length;
  if (validGeminiCount > 0) {
    console.log("Using hybrid embedding (Gemini + Bag-of-Words).");
    const hybridVector = geminiVector.concat(bowVector);
    console.log("Hybrid embedding vector:", hybridVector);
    return hybridVector;
  } else {
    console.log("Gemini embedding invalid; using Bag-of-Words embedding only.");
    return bowVector;
  }
};

//
// Wrapper Function for Database Integration: Store embedding in MongoDB
//
export const storeEmbeddingInDB = async (query, answer) => {
  const embedding = await generateHybridEmbedding(query);
  await insertEmbedding(query, embedding, answer);
};
