import axios from 'axios';

export const classifyQuery = async (query) => {
  try {
    const prompt = `Classify the following legal query into a category (e.g., constitutional, cyber law, criminal, civil, etc.) and respond with only one word: "${query}"`;
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
      console.error("Raw response from Gemini in classifyQuery:", response.data);
      throw new Error("Invalid response from Gemini API in classifyQuery");
    }
    
    const category = response.data.candidates[0].content.parts[0].text.trim();
    return category;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Classification rate limit reached (429). Falling back.');
      return 'uncategorized';
    }
    console.error('Error classifying query:', error.message);
    return 'uncategorized';
  }
};
