const { NlpManager } = require('node-nlp');
const fs = require('fs');
const natural = require('natural');
const { WordTokenizer } = require('natural');

const manager = new NlpManager({ languages: ['en'] });
const intentsFile = './data/legal-intents.json';
const configFile = './data/config.json';

if (!fs.existsSync(intentsFile)) {
    console.error("Error: legal-intents.json file not found!");
    process.exit(1);
}

const intentsData = JSON.parse(fs.readFileSync(intentsFile, 'utf8'));
const tokenizer = new WordTokenizer();
const tfidf = new natural.TfIdf();


const config = fs.existsSync(configFile) 
    ? JSON.parse(fs.readFileSync(configFile, 'utf8')) 
    : { categories: {}, legalTerms: [] };


function searchRelevantIntents(query) {
    const words = tokenizer.tokenize(query.toLowerCase());
    let bestMatch = { intent: null, score: 0 };
    
    intentsData.intents.forEach(intent => {
        let score = intent.patterns.reduce((acc, pattern) => {
            const patternWords = tokenizer.tokenize(pattern.toLowerCase());
            return acc + words.filter(word => patternWords.includes(word)).length;
        }, 0);
        
        if (score > bestMatch.score) {
            bestMatch = { intent, score };
        }
    });
    
    return bestMatch.intent ? bestMatch.intent.tag : null;
}


function classifyQuery(query) {
    for (const [category, keywords] of Object.entries(config.categories)) {
        if (keywords.some(keyword => query.toLowerCase().includes(keyword))) {
            return category;
        }
    }
    return "general legal";
}


function extractLegalTerms(query) {
    return tokenizer.tokenize(query.toLowerCase()).filter(word => config.legalTerms.includes(word));
}


function summarizeText(text, numSentences = 3) {
    const sentenceTokenizer = new natural.SentenceTokenizer();
    const sentences = sentenceTokenizer.tokenize(text);
    if (sentences.length <= numSentences) return text;
    
    sentences.forEach(sentence => tfidf.addDocument(sentence));
    
    const scoredSentences = sentences.map((sentence, index) => {
        let score = tfidf.listTerms(index).reduce((acc, term) => acc + term.tfidf, 0);
        return { sentence, score };
    });
    
    return scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, numSentences)
        .map(s => s.sentence)
        .join(" ");
}


function generateResponse(query, category, legalTerms) {
    return `It seems you are asking about ${category}. I noticed terms like ${legalTerms.join(', ') || 'N/A'} in your query. 
Please note that this information is for general informational purposes only. For detailed advice, consult a legal professional.`;
}

async function trainChatbot() {
    if (!intentsData.intents) {
        console.error("Error: Invalid intents data format!");
        return;
    }
    
    intentsData.intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
            manager.addDocument('en', pattern, intent.tag);
        });
        intent.responses.forEach(response => {
            manager.addAnswer('en', intent.tag, response);
        });
    });
    
    await manager.train();
    manager.save();
    console.log("✅ Legal AI Chatbot trained successfully!");
}


async function getResponse(query) {
    
    const category = classifyQuery(query);
    
    
    const legalTerms = extractLegalTerms(query);
    
    
    const summarizedQuery = summarizeText(query);
    
    
    const bestIntent = searchRelevantIntents(summarizedQuery);
    
    
    console.log(`🔹 Category: ${category}`);
    console.log(`🔹 Extracted Terms: ${legalTerms.join(', ') || "None"}`);
    console.log(`🔹 Summarized Input: ${summarizedQuery}`);
    
    
    if (bestIntent) {
        const response = await manager.process('en', summarizedQuery);
        
        if (response.answer) {
            return response.answer;
        }
    }
   
    return generateResponse(query, category, legalTerms);
}

module.exports = { trainChatbot, getResponse };

if (require.main === module) {
    trainChatbot();
}
