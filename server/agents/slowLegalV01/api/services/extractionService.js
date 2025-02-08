import axios from 'axios';

export const extractEntities = async (text) => {
  try {
    const prompt = `Extract key legal terms or keywords from the following text and list them separated by commas: "${text}"`;
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
      console.error("Raw response from Gemini in extractEntities:", response.data);
      throw new Error("Invalid response from Gemini API in extractEntities");
    }
    
    const output = response.data.candidates[0].content.parts[0].text.trim();
    const entities = output.split(',').map(item => item.trim());
    return entities;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Entity extraction rate limit reached (429). Falling back.');
      return [];
    }
    console.error('Error extracting entities:', error.message);
    return [];
  }
};
