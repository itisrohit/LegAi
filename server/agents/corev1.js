const { NlpManager } = require('node-nlp');
const fs = require('fs');
const natural = require('natural');
const { WordTokenizer, TfIdf, PorterStemmer, JaroWinklerDistance, LevenshteinDistance } = natural;
const schedule = require('node-schedule');

const manager = new NlpManager({ languages: ['en'] });
const intentsFile = './datas/legal-intents.json';
const unansweredFile = './datas/unanswered-queries.json';
const configFile = './datas/config.json';

if (!fs.existsSync(intentsFile)) {
    console.error("Error: legal-intents.json file not found!");
    process.exit(1);
}

const intentsData = JSON.parse(fs.readFileSync(intentsFile, 'utf8'));
const tokenizer = new WordTokenizer();
const tfidf = new TfIdf();
const config = fs.existsSync(configFile) 
    ? JSON.parse(fs.readFileSync(configFile, 'utf8')) 
    : { categories: {}, legalTerms: [] };

function preprocess(text) {
    return tokenizer.tokenize(text.toLowerCase()).map(word => PorterStemmer.stem(word)).join(" ");
}


function searchRelevantIntents(query) {
    const queryProcessed = preprocess(query);
    let bestMatch = { intent: null, score: 0 };

    intentsData.intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
            const patternProcessed = preprocess(pattern);
            tfidf.addDocument(patternProcessed);
        });
    });

    tfidf.tfidfs(queryProcessed, (index, measure) => {
        if (measure > bestMatch.score) {
            bestMatch = { intent: intentsData.intents[index], score: measure };
        }
    });

    return bestMatch.intent ? bestMatch.intent.tag : null;
}


function fuzzyMatch(query) {
    let bestMatch = { intent: null, score: 0 };
    const queryProcessed = preprocess(query);

    intentsData.intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
            const patternProcessed = preprocess(pattern);
            const score = 1 - (LevenshteinDistance(queryProcessed, patternProcessed) / Math.max(queryProcessed.length, patternProcessed.length));

            if (score > bestMatch.score) {
                bestMatch = { intent: intent.tag, score };
            }
        });
    });

    return bestMatch.score > 0.7 ? bestMatch.intent : null;
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

    const scoredSentences = sentences.map((sentence, index) => ({
        sentence, 
        score: tfidf.listTerms(index).reduce((acc, term) => acc + term.tfidf, 0)
    }));

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


function saveUnansweredQuery(query) {
    let unansweredQueries = fs.existsSync(unansweredFile) ? JSON.parse(fs.readFileSync(unansweredFile, 'utf8')) : [];
    if (!unansweredQueries.includes(query)) {
        unansweredQueries.push(query);
        fs.writeFileSync(unansweredFile, JSON.stringify(unansweredQueries, null, 2));
    }
}


async function getResponse(query) {
    const category = classifyQuery(query);
    const legalTerms = extractLegalTerms(query);
    const summarizedQuery = summarizeText(query);

    console.log(`🔹 Category: ${category}`);
    console.log(`🔹 Extracted Terms: ${legalTerms.join(', ') || "None"}`);
    console.log(`🔹 Summarized Input: ${summarizedQuery}`);

    let bestIntent = searchRelevantIntents(summarizedQuery);

    if (!bestIntent) {
        bestIntent = fuzzyMatch(query); 
    }

    if (bestIntent) {
        const response = await manager.process('en', summarizedQuery);
        if (response.answer) {
            return response.answer;
        }
    }

    saveUnansweredQuery(query);
    return generateResponse(query, category, legalTerms);
}


function addNewIntents() {
    if (!fs.existsSync(unansweredFile)) return;
    let unansweredQueries = JSON.parse(fs.readFileSync(unansweredFile, 'utf8'));
    if (unansweredQueries.length === 0) return;

    let intentsData = JSON.parse(fs.readFileSync(intentsFile, 'utf8'));

    unansweredQueries.forEach((query, index) => {
        const newIntentTag = `unanswered_${Date.now()}_${index}`;

        intentsData.intents.push({
            tag: newIntentTag,
            patterns: [query],
            responses: ["I'm still learning about this. Let me improve my knowledge and get back to you!"]
        });

        console.log(`✅ Added new intent: ${newIntentTag}`);
    });

    fs.writeFileSync(intentsFile, JSON.stringify(intentsData, null, 2));
    fs.writeFileSync(unansweredFile, JSON.stringify([], null, 2));
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

schedule.scheduleJob('0 0 * * *', async function() {
    console.log("⏳ Auto-training chatbot with new data...");
    addNewIntents();
    await trainChatbot();
    console.log("🚀 Auto-training completed!");
});

module.exports = { trainChatbot, getResponse, classifyQuery, extractLegalTerms, summarizeText, generateResponse };
