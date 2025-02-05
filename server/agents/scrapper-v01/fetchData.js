const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();

const API_TOKEN = process.env.INDIAN_KANOON_API_TOKEN;
const HEADERS = {
  'Authorization': `Token ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  const fetch = (await import('node-fetch')).default;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Fetch error: ${error.message}. Retrying (${i + 1}/${retries})...`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

async function fetchSearchQuery(query, pagenum) {
  const url = `https://api.indiankanoon.org/search/?formInput=${encodeURIComponent(query)}&pagenum=${pagenum}`;
  return await fetchWithRetry(url, { method: 'POST', headers: HEADERS });
}

async function fetchDocument(docid) {
  const url = `https://api.indiankanoon.org/doc/${docid}/`;
  console.log(`Fetching document: ${url}`);
  return await fetchWithRetry(url, { method: 'POST', headers: HEADERS });
}

async function fetchDocumentFragments(docid, query) {
  const url = `https://api.indiankanoon.org/docfragment/${docid}/?formInput=${encodeURIComponent(query)}`;
  console.log(`Fetching document fragments: ${url}`);
  return await fetchWithRetry(url, { method: 'POST', headers: HEADERS });
}

async function fetchDocumentMetainfo(docid) {
  const url = `https://api.indiankanoon.org/docmeta/${docid}/`;
  console.log(`Fetching document metainfo: ${url}`);
  return await fetchWithRetry(url, { method: 'POST', headers: HEADERS });
}

function cleanText(html) {
  const cleanedHtml = sanitizeHtml(html, {
    allowedTags: [], // Remove all HTML tags
    allowedAttributes: {} // Remove all attributes
  });
  return cleanedHtml.replace(/\s+/g, ' ').trim(); // Remove extra whitespace
}

function documentExists(documents, docId) {
  return documents.some(doc => doc.link.includes(docId));
}

async function generateJsonFile(query, totalDocs) {
  let existingData = [];

  // Ensure the datas directory exists
  if (!fs.existsSync('../../datas')) {
    fs.mkdirSync('../../datas');
  }

  try {
    const rawData = fs.readFileSync('../../datas/manualData.json', 'utf8');
    existingData = JSON.parse(rawData);
  } catch (err) {
    console.warn("../../datas/manualData.json not found or invalid. Starting with an empty array.");
  }

  const results = [...existingData];
  let newDocsCount = 0;
  let pagenum = 1;

  while (newDocsCount < totalDocs) {
    const searchResult = await fetchSearchQuery(query, pagenum);
    const docs = searchResult.docs || [];
    console.log(`Fetched ${docs.length} documents from page ${pagenum}`);

    if (!docs.length) break;

    for (const doc of docs) {
      if (documentExists(existingData, doc.tid)) {
        console.log(`Document with ID ${doc.tid} already exists. Skipping.`);
        continue;
      }

      const docData = await fetchDocument(doc.tid);
      const docMeta = await fetchDocumentMetainfo(doc.tid);
      const docFragments = await fetchDocumentFragments(doc.tid, query);
      const plainTextContent = docFragments.headline ? cleanText(docFragments.headline.join(' ')) : "No headline available";

      const newDoc = {
        title: docData.title,
        link: `https://indiankanoon.org/doc/${doc.tid}/`,
        docsource: docMeta.doctype,
        content: plainTextContent // Store the plain text content
      };

      results.push(newDoc);
      existingData.push(newDoc);
      newDocsCount++;

      if (newDocsCount >= totalDocs) break;
    }

    pagenum++;
  }

  fs.writeFileSync('../../datas/manualData.json', JSON.stringify(results, null, 2));
  console.log('Data written to ../../datas/manualData.json');
}

// Run the script with a sample query and fetch exactly 5 new documents
generateJsonFile('Section 420 IPC', 5).catch(console.error);