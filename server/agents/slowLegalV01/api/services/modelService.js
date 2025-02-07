// api/services/modelService.js
import fs from 'fs';
import { generateEmbeddings } from './embeddingService.js';

export const reloadModel = async () => {
  const manualData = JSON.parse(fs.readFileSync('api/data/manualData.json', 'utf-8'));
  const updatedData = await Promise.all(manualData.map(async (item) => {
    return {
      ...item,
      embedding: await generateEmbeddings(item.query)
    };
  }));
  fs.writeFileSync('api/data/manualData.json', JSON.stringify(updatedData, null, 2));
  console.log('Model reloaded successfully with updated data!');
};
