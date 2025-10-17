# Amazon Listing Optimizer ✨

An AI-powered web application that scrapes Amazon product data, uses the Gemini API to generate optimized content, and stores a history of all optimizations. This project was built to demonstrate full-stack development skills using the PERN stack (React, Node.js, Express, MySQL).

![Amazon Listing Optimizer Demo](SalesDuoRec-ezgif.com-video-to-gif-converter.gif)

## Features

  * **Scrape Live Data**: Fetches product title, bullet points, and description directly from an Amazon product page using an ASIN.
  * **AI-Powered Optimization**: Leverages a Large Language Model (Gemini) to generate an improved title, rewritten bullet points, an enhanced description, and SEO keywords.
  * **Side-by-Side Comparison**: A clean user interface to compare the original and AI-optimized versions.
  * **Persistent History**: Stores every optimization run in a MySQL database.
  * **Routing & Navigation**: Uses React Router for a multi-page experience to view the history of all searched ASINs and their detailed optimization records.

-----

## Tech Stack

  * **Frontend**: React, React Router, Axios
  * **Backend**: Node.js, Express
  * **Database**: MySQL
  * **AI Integration**: Google Gemini API
  * **Web Scraping**: Cheerio, Axios

-----

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

  * [Node.js](https://nodejs.org/en/) (v16 or later recommended)
  * [Git](https://git-scm.com/)
  * [MySQL Workbench](https://www.mysql.com/products/workbench/) or another MySQL client

-----

## Local Setup Instructions

Follow these steps to get the project running on your local machine.

### 1\. Clone the Repository

First, clone the project from your GitHub repository to your local machine.

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2\. Backend Setup

1.  **Navigate to the backend folder**:

    ```bash
    cd backend
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Create an environment file**: Create a file named `.env` in the `backend` directory and add the following variables.

    ```
    # .env
    GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"

    # Your Local MySQL Credentials
    DB_HOST="localhost"
    DB_USER="your_mysql_username"
    DB_PASSWORD="your_mysql_password"
    DB_NAME="salesduo_db"
    ```

### 3\. Database Setup

1.  Open MySQL Workbench and connect to your local MySQL server.

2.  Run the following SQL script to create the necessary database and table:

    ```sql
    -- Create the database if it doesn't exist
    CREATE DATABASE IF NOT EXISTS salesduo_db;

    -- Switch to the new database
    USE salesduo_db;

    -- Create the optimizations table
    CREATE TABLE IF NOT EXISTS optimizations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        asin VARCHAR(20) NOT NULL,
        original_title TEXT,
        original_bullets TEXT,
        original_description TEXT,
        optimized_title TEXT,
        optimized_bullets TEXT,
        optimized_description TEXT,
        suggested_keywords TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

### 4\. Frontend Setup

1.  **Open a new terminal**. Navigate to the frontend folder from the project root:

    ```bash
    cd frontend
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

-----

## Running the Application

You need to run both the backend and frontend servers simultaneously in separate terminals.

  * **To start the backend server** (from the `backend` folder):

    ```bash
    npm start
    ```

    The backend will be running at `http://localhost:5000`.

  * **To start the frontend application** (from the `frontend` folder):

    ```bash
    npm start
    ```

    The frontend will automatically open in your browser at `http://localhost:3000`.

-----

## AI Prompt Engineering

To ensure high-quality, structured output from the Gemini API, the following prompt was engineered:

> ```
> You are an expert Amazon Listing Optimizer. Your goal is to improve product listings to increase sales.
> Analyze the following Amazon product details:
> ```

> Original Title: "${productDetails.title}"
> Original Bullet Points:
> ${productDetails.bulletPoints}
> Original Description: "${productDetails.description}"

> Now, generate an optimized version in a valid JSON format. Do not include any text before or after the JSON object.
> The JSON object should have these exact keys: "newTitle", "newBullets", "newDescription", "keywords".
>
>   - newTitle: Create a keyword-rich, highly readable title under 200 characters.
>   - newBullets: Rewrite the bullet points to be clear, concise, and benefit-oriented. Return them as an array of strings.
>   - newDescription: Enhance the description to be persuasive and engaging, but avoid making unsupported claims.
>   - keywords: Suggest 5 relevant SEO keywords as an array of strings that are not already obvious from the title.
>
> <!-- end list -->
>
> ```
> ```

**Reasoning:**

  * **Role-Playing**: Assigning the role of "expert Amazon Listing Optimizer" sets the context for the AI.
  * **Strict JSON Output**: Demanding a specific JSON format with exact keys makes the response predictable and easy to parse in the Node.js backend without string manipulation.
  * **Clear Constraints**: Providing specific instructions for each key (e.g., character limits, benefit-oriented language, array format) guides the AI to produce the desired output.
