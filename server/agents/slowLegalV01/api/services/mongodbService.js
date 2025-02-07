import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;
let collection;

export const connectDB = async () => {
  try {
    if (!db) {
      await client.connect();
      db = client.db('legal_ai');
      collection = db.collection('queries');
      console.log("Successfully connected to MongoDB Atlas. Database: 'legal_ai', Collection: 'queries'");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
};

export const insertEmbedding = async (query, embedding, answer) => {
  try {
    await connectDB();
    const newQuery = {
      query,
      embedding,
      answer,
      createdAt: new Date()
    };
    const result = await collection.insertOne(newQuery);
    if (result.acknowledged) {
      console.log(`Successfully inserted query: "${query}" into MongoDB.`);
    } else {
      console.warn(`Insertion of query: "${query}" was not acknowledged by MongoDB.`);
    }
  } catch (error) {
    console.error("Error inserting embedding into MongoDB:", error);
  }
};

export const updateEmbedding = async (query, embedding, answer) => {
  try {
    await connectDB();
    const result = await collection.updateOne(
      { query },
      { $set: { embedding, answer, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log(`Successfully updated query: "${query}" in MongoDB. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  } catch (error) {
    console.error("Error updating embedding in MongoDB:", error);
  }
};

export const existsInMongoDB = async (query) => {
  try {
    await connectDB();
    const result = await collection.findOne({ query });
    return result;
  } catch (error) {
    console.error("Error checking existence in MongoDB:", error);
    return null;
  }
};

export const searchMongoDBForQuery = async (query) => {
  try {
    await connectDB();
    // For simplicity, we perform a simple lookup by query text.
    const result = await collection.findOne({ query });
    if (result) {
      console.log("Found record in MongoDB:", result);
      return [result];
    }
    return [];
  } catch (error) {
    console.error("Error performing search in MongoDB:", error);
    return [];
  }
};
