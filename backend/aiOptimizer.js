// backend/aiOptimizer.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function optimizeListing(productDetails) {
  const prompt = `
    You are an expert Amazon Listing Optimizer. Your goal is to improve product listings to increase sales.
    Analyze the following Amazon product details:

    Original Title: "${productDetails.title}"
    Original Bullet Points:
    ${productDetails.bulletPoints}
    Original Description: "${productDetails.description}"

    Now, generate an optimized version in a valid JSON format. Do not include any text before or after the JSON object.
    The JSON object should have these exact keys: "newTitle", "newBullets", "newDescription", "keywords".
    - newTitle: Create a keyword-rich, highly readable title under 200 characters.
    - newBullets: Rewrite the bullet points to be clear, concise, and benefit-oriented. Return them as an array of strings.
    - newDescription: Enhance the description to be persuasive and engaging, but avoid making unsupported claims.
    - keywords: Suggest 5 relevant SEO keywords as an array of strings that are not already obvious from the title.

    Example output format:
    {
      "newTitle": "Example Optimized Title with Keywords",
      "newBullets": ["Benefit-driven bullet point 1.", "Clear and concise bullet point 2."],
      "newDescription": "This is an engaging and persuasive new product description. This must be in markdown format with strong keywords in bold.",
      "keywords": ["backend seo", "amazon fba", "product optimization", "e-commerce sales", "listing helper"]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Clean the response to ensure it's valid JSON
  const jsonResponse = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonResponse);
}

module.exports = { optimizeListing };
