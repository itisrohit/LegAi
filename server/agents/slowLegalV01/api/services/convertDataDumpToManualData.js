import fs from 'fs';
import dotenv from 'dotenv';
import { generateHybridEmbedding } from './embeddingService.js';
import { classifyQuery } from './classificationService.js';
import { extractEntities } from './extractionService.js';
import { checkForDuplicates, addToManualData } from './manualDataService.js';
import { existsInMongoDB } from './mongodbService.js';
import { storeEmbeddingInDB } from './embeddingService.js';
import { preprocessInput } from './geminiService.js';

dotenv.config();

export const convertDataDumpToManualData = async () => {
  try {
    const datadump = JSON.parse(fs.readFileSync('api/data/datadump.json', 'utf-8'));
    
    for (const item of datadump) {
      const { query, answer, category } = item;
      
      // Normalize the query
      const normalizedQuery = await preprocessInput(query);
      
      // Check if record exists locally
      if (await checkForDuplicates(normalizedQuery)) {
        console.log(`Duplicate query found locally: "${normalizedQuery}". Skipping this record.`);
        continue;
      }
      
      // Check if record exists in MongoDB
      const existingRecord = await existsInMongoDB(normalizedQuery);
      if (existingRecord) {
        console.log(`Query already exists in MongoDB: "${normalizedQuery}". Skipping this record.`);
        continue;
      }
      
      // Process new record:
      const embedding = await generateHybridEmbedding(normalizedQuery);
      const classifiedCategory = await classifyQuery(normalizedQuery);
      const keywords = await extractEntities(answer);
      
      const newData = {
        id: new Date().getTime().toString(),
        query: normalizedQuery,
        answer,
        category: classifiedCategory || category,
        keywords,
        embedding
      };
      
      await addToManualData(newData);
      await storeEmbeddingInDB(normalizedQuery, answer);
    }
    
    console.log('Conversion of datadump.json to manualData.json and MongoDB update completed successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
};

convertDataDumpToManualData();
