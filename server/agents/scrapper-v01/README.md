# Scrapper-V01

## NPM Packages Used

### Dependencies
- `@huggingface/inference`: Used to interact with the Hugging Face Inference API for generating summaries.
- `dotenv`: Loads environment variables from a `.env` file.
- `node-fetch`: A lightweight module that brings `window.fetch` to Node.js.
- `sanitize-html`: Used to clean and sanitize HTML content.

### Dev Dependencies
- `npm-run-all`: A CLI tool to run multiple npm scripts sequentially or in parallel.

## Overview

This project fetches legal case data from the Indian Kanoon API, processes it, and generates summaries using the Hugging Face Inference API. The data is stored in `manualData.json`, and the results are written to `result.json`.

## Environment Variables

Create a `.env` file in the root directory and add the following variables:
```
HF_API_TOKEN=
INDIAN_KANOON_API_TOKEN=
```

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Installation

To install the dependencies and dev dependencies manually, run the following commands:
   ```sh
   npm i @huggingface/inference dotenv node-fetch sanitize-html
   npm i npm-run-all --save-dev
   ```

To install the dependencies and dev dependencies at once, run the following command:
   ```sh
   npm install
   ```

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Usage

### Running the Project

To run the project, use the following command:
   ```sh
   npm start
   ```
This command will:
- Execute `fetchData.js` to fetch new legal case data and store it in `manualData.json`.
- Execute `index.js` to process the data in `manualData.json`, generate summaries, and write the results to `result.json`.

### Running Scripts Manually

If you want to run the scripts manually, you can use the following commands:

#### Fetch Data
   ```sh
   node fetchData.js
   ```
This script fetches new legal case data from the Indian Kanoon API and stores it in `manualData.json`. It ensures that no duplicate data is added.

#### Process Data
   ```sh
   node index.js
   ```
This script processes the data in `manualData.json`, generates summaries using the Hugging Face Inference API, and writes the results to `result.json`.

## Explanation of Scripts

### `fetchData.js`
**Purpose:** Fetches legal case data from the Indian Kanoon API.

**Functionality:**
- Reads existing data from `manualData.json`.
- Fetches new legal case data based on a query (e.g., "Section 420 IPC").
- Ensures no duplicate data is added.
- Writes the fetched data to `manualData.json`.

### `index.js`
**Purpose:** Processes the fetched legal case data and generates summaries.

**Functionality:**
- Reads data from `manualData.json`.
- Generates tags and patterns based on the content of each document.
- Uses the Hugging Face Inference API to generate summaries for each document.
- Writes the processed data and summaries to `result.json`.

## Example Data

### `manualData.json`
Contains the fetched legal case data in JSON format.

### `result.json`
Contains the processed data and summaries in JSON format.

