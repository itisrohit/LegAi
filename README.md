# LegAi Chat App

LegAi Chat App is an AI-powered legal advice assistant built for the AI Hackathon. It helps users answer legal queries, and extract key legal information—all through an interactive chat interface.

## Overview

LegAi Chat App uses a Retrieval-Augmented Generation (RAG) approach to deliver fast and accurate legal advice. The system leverages four core use cases:
1. **Semantic Search:** Retrieve relevant legal documents based on meaning rather than just keywords.
2. **Legal Classification:** Categorize legal queries into relevant domains.
3. **Key Information Extraction:** Identify critical legal clauses, obligations, and risks.
4. **Answer Generation:** Produce clear and concise responses to legal questions.

## Features

- **RAG-based Architecture:**  
  Combines retrieval (from MongoDB) and generation (using our slowLegalV01 model) to provide informed and context-aware legal answers.
  
- **Local Query Normalization:**  
  Converts incoming queries to lowercase, removes punctuation, and trims whitespace to ensure consistent duplicate checking.

- **Scope Verification:**  
  Uses a built-in check (via our AI model) to determine if a query is within the legal domain before processing it.

- **Hybrid Embeddings:**  
  Combines placeholder embeddings generated by the AI model with a lightweight bag-of-words approach for robust representation.

- **Duplicate Handling:**  
  Checks for duplicate queries in both local storage and MongoDB to avoid redundant processing and API calls.

- **MongoDB Atlas Integration:**  
  Stores processed query–answer pairs (with embeddings) in a MongoDB Atlas cluster.

- **Interactive Chat Interface:**  
  Provides an engaging chat-based interface for quick legal advice.

## Tech Stack

- **Backend:** Node.js with Fastify
- **AI Models:** slowLegalV01 for answer generation, classification, extraction, and placeholder embeddings
- **Database:** MongoDB Atlas
- **Frontend:** React, Tailwind

## Problem Statement

Legal help is often expensive, slow, and hard to access—especially in rural areas of India where many people struggle to understand complex legal terminology and find the right laws. Traditional legal services are not always affordable, leaving many without the necessary guidance to protect their rights.

## Our Solution

LegAi Chat App leverages advanced AI techniques and a RAG-based approach to break down complex legal language into clear, actionable insights. Users can type in their legal questions and receive concise, reliable answers. This approach makes legal information accessible to everyone, particularly those in underserved areas.

## AI Models and Use Cases

LegAi Chat App utilizes our proprietary slowLegalV01 model to cover four key use cases:
- **Search:** Retrieves relevant legal documents based on semantic understanding.
- **Classification:** Automatically categorizes legal queries.
- **Extraction:** Identifies and extracts key legal terms and clauses.
- **Generation:** Produces clear, concise legal advice responses.

## Design & Prototype

- **Figma Design:** [View Design](https://www.figma.com/design/G3m2sfcM7gdepNcfwBAytv/AI-Prototyping?node-id=0-1&p=f&t=md81dX8oHytgNn1c-0)
- **Figma Prototype:** [View Prototype](https://www.figma.com/proto/G3m2sfcM7gdepNcfwBAytv/AI-Prototyping?node-id=0-1&t=PKOmx0SHub6OrPpZ-1)

## Team Members

- **Rohit Kumar** ([GitHub](https://github.com/itisrohit/LegAi))
- **Diya Shrivastava**
- **Mohan Raj A**
- **Nishat Ayub**
- **Nithin Varma**

## Getting Started

### Prerequisites

- **Node.js:** v14 or later
- **npm:** Installed with Node.js
- **MongoDB Atlas:** A running MongoDB Atlas cluster
- **Gemini API Key:** For accessing the slowLegalV01 model

### Installation

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/itisrohit/LegAi.git
   cd LegAi
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the project root with the following content (replace placeholders accordingly):

   ```dotenv
   PORT=3000
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/legal_ai?retryWrites=true&w=majority"
   GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY"
   ```

4. **Run the Data Conversion Script:**

   Process raw data from `api/data/datadump.json` and update local storage and MongoDB:

   ```sh
   npm run convert
   ```

## Running the Server

Start the Fastify API server:

```sh
npm start
```

You should see:

```
✅ Server listening at http://0.0.0.0:3000
```

## API Usage

### Endpoint

**POST** `/query`

### Request Body

Send a JSON payload with the key `query`. For example:

```json
{
  "query": "What is IPC 370?"
}
```

### Response

- **Existing Query:**  
  If the normalized query already exists in MongoDB, its stored answer is returned.

- **New Query:**  
  If the query is new and in scope, the slowLegalV01 model generates an answer (with automatic retries if necessary) and the new record is stored both locally and in MongoDB.

- **Out-of-Scope Query:**  
  If the query is determined to be out of scope, you receive:

  ```json
  {
    "answer": "Sorry, ask something legal related."
  }
  ```

Example response for an in-scope query:

```json
{
  "answer": "Intellectual property law protects creative works through copyrights, patents, trademarks, and trade secrets.",
  "accuracy": 100
}
```

## Testing with Postman

1. **Start the Server:**

   ```sh
   npm start
   ```

2. **Create a New POST Request:**
   - **URL:** `http://localhost:3000/query`
   - **Method:** POST
   - **Headers:**  
     - `Content-Type: application/json`
   - **Body (raw JSON):**

     ```json
     {
       "query": "What is IPC 370?"
     }
     ```

3. **Send the Request:**  
   - If the normalized query exists in MongoDB, its stored answer is returned.
   - Otherwise, a new answer is generated (with automatic retries if needed) and the new record is stored.

4. **Verify in MongoDB Atlas:**  
   Log into your Atlas dashboard, navigate to your `legal_ai` database, and inspect the `queries` collection. Each unique normalized query should be stored only once.

## Contribution

Contributions are welcome! Please submit issues or pull requests with your suggestions or improvements.


## Repository

[GitHub Repository](https://github.com/itisrohit/LegAi)
