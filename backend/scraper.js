// backend/scraper.js
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAmazonProduct(asin, domain = 'www.amazon.in') {
  try {
    const url = `https://${domain}/dp/${asin}`;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    };
    console.log('Attempting to scrape URL:', url);

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    // Initial extractions
    const title = $('#productTitle').text().trim();
    const bulletPoints = [];
    $('#feature-bullets .a-list-item').each((i, el) => {
      bulletPoints.push($(el).text().trim());
    });

    // Object to store the table data
    const productTableDetails = {};
    const description = []; // Use an array to build the description

    // Scrape the table and store the data in an object
    $('#productDetails_feature_div tbody tr').each((i, row) => {
      const key = $(row).find('.prodDetSectionEntry').text().trim();
      const value = $(row).find('.prodDetAttrValue').text().trim();
      if (key && value) {
        productTableDetails[key] = value;
      }
    });

    // You can also format this as a string for a simple description
    for (const key in productTableDetails) {
      if (Object.prototype.hasOwnProperty.call(productTableDetails, key)) {
        description.push(`${key}: ${productTableDetails[key]}`);
      }
    }

    // Check if the scrape was successful
    if (!title) {
      throw new Error('Scraping failed: Could not find product title. The page structure may have changed.');
    }

    return {
      title,
      bulletPoints: bulletPoints.join('\n'),
      description: description.join('\n\n'), // Join the array into a single string
    };
  } catch (error) {
    console.error(`Scraping failed for ASIN ${asin}:`, error.message);
    throw new Error(`Could not fetch product details for ASIN ${asin}. The ASIN might be invalid or Amazon blocked the request.`);
  }
}

module.exports = { scrapeAmazonProduct };