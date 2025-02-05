// index.js

// For Node v18+, fetch is available globally.
// For older versions, uncomment the following line:
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// WARNING: For testing only. DO NOT use this in production.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Ensure the datas directory exists
if (!fs.existsSync('../../datas')) {
  fs.mkdirSync('../../datas');
}

// Read and parse manualData.json
let rawData;
try {
  rawData = fs.readFileSync('../../datas/manualData.json', 'utf8');
} catch (err) {
  if (err.code === 'ENOENT') {
    console.warn("../../datas/manualData.json not found. Creating an empty file.");
    fs.writeFileSync('../../datas/manualData.json', '[]');
    rawData = '[]';
  } else {
    console.error("Error reading ../../datas/manualData.json:", err);
    process.exit(1);
  }
}

let documents;
try {
  documents = JSON.parse(rawData);
  if (!Array.isArray(documents)) {
    throw new Error("../../datas/manualData.json must be an array of objects.");
  }
} catch (err) {
  console.error("Error parsing ../../datas/manualData.json:", err);
  process.exit(1);
}

// Read and parse result.json
let rawResultData;
try {
  rawResultData = fs.readFileSync('../../datas/result.json', 'utf8');
} catch (err) {
  if (err.code === 'ENOENT') {
    console.warn("../../datas/result.json not found. Creating an empty file.");
    fs.writeFileSync('../../datas/result.json', '[]');
    rawResultData = '[]';
  } else {
    console.error("Error reading ../../datas/result.json:", err);
    process.exit(1);
  }
}

let results;
try {
  results = JSON.parse(rawResultData);
  if (!Array.isArray(results)) {
    throw new Error("../../datas/result.json must be an array of objects.");
  }
} catch (err) {
  console.error("Error parsing ../../datas/result.json:", err);
  process.exit(1);
}

// Helper: Generate a dynamic tag based on content keywords.
function generateTag(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("domestic violence")) return "legal_domestic_violence";
  if (lowerText.includes("dowry")) return "legal_dowry";
  if (lowerText.includes("corruption")) return "legal_corruption";
  if (lowerText.includes("ipc")) return "legal_ipc";
  if (lowerText.includes("supreme court")) return "legal_supreme_court";
  return "legal_general";
}

// Helper: Return patterns based on content keywords.
function getPatterns(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("domestic violence")) {
    return [
      "What are the charges related to domestic violence?",
      "How does the law protect victims of domestic violence?",
      "What penalties are imposed for domestic violence?"
    ];
  }
  if (lowerText.includes("dowry")) {
    return [
      "What dowry-related charges are mentioned?",
      "How is dowry harassment addressed by the law?",
      "What are the legal consequences of dowry demands?"
    ];
  }
  if (lowerText.includes("ipc")) {
    return [
      "What are the main legal charges under the IPC?",
      "What sentences were imposed under the IPC?",
      "What is the overall court decision under the IPC framework?"
    ];
  }
  // Default patterns
  return [
    "What are the legal charges in the document?",
    "What sentences or penalties were imposed?",
    "What is the overall court decision?"
  ];
}

// Summarize text using Hugging Face Inference API with a stable model ("facebook/bart-large-cnn")
async function summarizeText(text, retries = 3, backoff = 1000) {
  const apiUrl = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
  const headers = {
    'Content-Type': 'application/json'
  };
  if (process.env.HF_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.HF_API_TOKEN}`;
  }

  // Clean and (optionally) truncate text if too long.
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const inputText = cleanText.length > 2000 ? cleanText.substring(0, 2000) : cleanText;

  const payload = {
    inputs: inputText,
    parameters: {
      min_length: 50,
      max_length: 150,
      do_sample: false // deterministic output
    }
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      const responseBody = await response.text();
      if (!response.ok) {
        if (responseBody.includes("currently loading")) {
          const match = responseBody.match(/"estimated_time":\s*([\d.]+)/);
          let waitTime = backoff;
          if (match && match[1]) {
            waitTime = parseFloat(match[1]) * 1000;
            console.log(`Model is loading. Waiting for ${waitTime} ms...`);
          }
          throw new Error(`Model loading, retrying after waiting ${waitTime} ms`);
        }
        throw new Error(`API error: ${response.status} ${response.statusText} - ${responseBody}`);
      }
      const result = JSON.parse(responseBody);
      if (Array.isArray(result) && result.length > 0 && result[0].summary_text) {
        return result[0].summary_text;
      }
      throw new Error('Unexpected response format.');
    } catch (error) {
      console.error(`Error during summarization (attempt ${attempt}):`, error.message);
      if (attempt === retries) {
        return "Summary not available. The document details several legal charges and court decisions.";
      }
      let delay = backoff * attempt;
      const estimatedMatch = error.message.match(/after waiting (\d+) ms/);
      if (estimatedMatch && estimatedMatch[1]) {
        delay = parseInt(estimatedMatch[1]);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

function resultExists(results, title) {
  return results.some(result => result.responses.some(response => response.includes(title)));
}

// Process all documents and write dynamic results to result.json
async function generateResults() {
  for (const doc of documents) {
    if (!doc.content || typeof doc.content !== 'string' || doc.content.trim().length === 0) {
      console.warn("Skipping document with invalid 'content':", doc);
      continue;
    }

    if (resultExists(results, doc.title)) {
      console.log(`Result for document titled "${doc.title}" already exists. Skipping.`);
      continue;
    }

    const tag = generateTag(doc.content);
    const patterns = getPatterns(doc.content);
    const summary = await summarizeText(doc.content);

    // Create response variations using title and docsource to make them dynamic
    const responses = [
      `According to "${doc.title}", the main charges and outcomes are: ${summary}`,
      `As stated by ${doc.docsource}, the legal penalties and court decisions are: ${summary}`,
      `In summary for "${doc.title}", the proceedings conclude: ${summary}`
    ];

    results.push({ tag, patterns, responses });
  }

  fs.writeFileSync('../../datas/result.json', JSON.stringify(results, null, 2));
  console.log('Result written to ../../datas/result.json');
}

generateResults();