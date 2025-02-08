# SlowLegalv01

## Overview

SlowLegalv01 is a Retrieval-Augmented Generation (RAG)-based legal question-answering system that leverages a MongoDB database and Gemini AI for legal query processing. The system fetches relevant legal documents from a database and uses an LLM to generate responses, ensuring both accuracy and contextual understanding.

## Features

- **Hybrid Embedding Model**: Combines Gemini-generated embeddings with a Bag-of-Words (BoW) approach for improved query understanding.
- **MongoDB for Storage**: Efficiently stores and retrieves legal queries and responses.
- **Fastify Backend**: Handles API requests and integrates with external AI services.
- **Gemini AI as a Supporting Model**: Used to validate query scope and enhance response generation.
- **Legal Query Filtering**: Ensures only relevant legal questions are processed.

## Installation

### Automatic Installation

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up environment variables in a `.env` file:
   ```sh
   MONGO_URI=<your_mongodb_connection>
   GEMINI_API_KEY=<your_gemini_api_key>
   PORT=3000
   ```
3. Start the server:
   ```sh
   npm start
   ```

### Manual Installation

If you prefer to install dependencies manually, run:

```sh
npm install axios dotenv fastify ioredis mongodb natural nodemon
```

## API Endpoints

### 1. Submit a Query

**POST** `/query`

- **Request Body**:
  ```json
  { "query": "What is intellectual property law?" }
  ```
- **Response**:
  ```json
  { "answer": "Intellectual property law refers to..." }
  ```

## Model Architecture

SlowLegalv01 follows a **Retrieval-Augmented Generation (RAG)** approach:

1. **Query Preprocessing**: Normalizes the input query.
2. **Embedding Generation**: Uses Gemini AI and a BoW model to create embeddings.
3. **Document Retrieval**: Searches MongoDB for relevant legal documents.
4. **Response Generation**: The LLM synthesizes a contextual response.
5. **Scope Validation**: Gemini AI ensures the question is within the legal domain.

## Implementation & Use Cases

1. **Use Case 1 - Query Processing**: The system processes and normalizes queries to improve search accuracy.
2. **Use Case 2 - Semantic Search**: Hybrid embeddings (Gemini + BoW) enable more accurate retrieval of legal documents.
3. **Use Case 3 - Query Scope Validation**: Gemini AI ensures that only legal-related queries are processed.
4. **Use Case 4 - AI-Assisted Response Generation**: The system uses LLMs to generate relevant answers from retrieved documents.

## Example Data Structure

After implementing the four use cases, data is structured as follows:

```json
{
    "id": "1234567890123",
    "query": "What are the fundamental rights in India?",
    "answer": "Fundamental rights in India include the right to equality, freedom of speech, and the right to constitutional remedies, among others.",
    "category": "Constitutional Law",
    "keywords": [
      "fundamental rights",
      "equality",
      "freedom of speech",
      "constitutional remedies"
    ],
    "embedding": [
      0.12, 0.23, 0.31, 0.45, 0.56, 0.67, 0.78
    ]
}
```

## Scripts

The following scripts are available in `package.json`:

- **`start`**: Runs `nodemon api/server.js` to start the server with automatic restarts on changes.
- **`watch`**: Runs `node api/watchModelUpdates.js` to monitor model updates.
- **`job`**: Runs `node workers/jobManager.js` to manage background tasks.
- **`convert`**: Runs `node api/services/convertDataDumpToManualData.js` to convert legacy data.

## Contributing

Feel free to submit issues and pull requests to enhance SlowLegalv01.

