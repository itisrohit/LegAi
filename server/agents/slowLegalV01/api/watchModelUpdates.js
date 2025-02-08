// api/watchModelUpdates.js
import fs from 'fs';
import { reloadModel } from './services/modelService.js';

fs.watchFile('api/data/manualData.json', async (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log('manualData.json updated, reloading model...');
    await reloadModel();
  }
});
