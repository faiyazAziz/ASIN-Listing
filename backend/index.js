// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const { scrapeAmazonProduct } = require('./scraper');
const { optimizeListing } = require('./aiOptimizer');
const db = require('./database'); 


app.post('/api/optimize', async (req, res) => {
  const { asin } = req.body;
  if (!asin) {
    return res.status(400).json({ error: 'ASIN is required' });
  }

  try {
    const originalDetails = await scrapeAmazonProduct(asin);
    const optimizedDetails = await optimizeListing(originalDetails);

    const dataToStore = {
        asin,
        original_title: originalDetails.title,
        original_bullets: originalDetails.bulletPoints,
        original_description: originalDetails.description,
        optimized_title: optimizedDetails.newTitle,
        optimized_bullets: JSON.stringify(optimizedDetails.newBullets), 
        optimized_description: optimizedDetails.newDescription,
        suggested_keywords: JSON.stringify(optimizedDetails.keywords)
    };

    await db.saveOptimization(dataToStore); 

    res.json({ original: originalDetails, optimized: optimizedDetails });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/history', async (req, res) => {
  try {
    const asins = await db.getUniqueAsins();
    res.json(asins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history list.' });
  }
});


app.get('/api/history/:asin', async (req, res) => {
    const { asin } = req.params;
    try {
        const history = await db.getHistory(asin);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
});