import fs from 'fs';

export const checkForDuplicates = async (query) => {
  try {
    const data = JSON.parse(fs.readFileSync('api/data/manualData.json', 'utf-8'));
    return data.some(item => item.query === query);
  } catch (error) {
    // If file doesn't exist or is empty, no duplicates exist
    return false;
  }
};

export const addToManualData = async (dataEntry) => {
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync('api/data/manualData.json', 'utf-8'));
  } catch (error) {
    data = [];
  }
  data.push(dataEntry);
  fs.writeFileSync('api/data/manualData.json', JSON.stringify(data, null, 2));
  console.log(`New entry added with query: ${dataEntry.query}`);
};
