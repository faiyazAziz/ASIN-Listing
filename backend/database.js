// backend/database.js
require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection pool. This is better than a single connection for a web server.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to save a new optimization record
async function saveOptimization(data) {
  const sql = 'INSERT INTO optimizations SET ?';
  try {
    const [result] = await pool.query(sql, [data]);
    return result;
  } catch (error) {
    console.error('Failed to save optimization:', error);
    throw new Error('Database query failed.');
  }
}

// Function to get the history for a specific ASIN
async function getHistory(asin) {
  const sql = 'SELECT * FROM optimizations WHERE asin = ? ORDER BY created_at DESC limit 1';
  try {
    const [rows] = await pool.query(sql, [asin]);
    return rows;
  } catch (error) {
    console.error('Failed to get history:', error);
    throw new Error('Database query failed.');
  }
}

// Function to get a list of all unique ASINs that have been optimized
async function getUniqueAsins() {
  const sql = 'SELECT asin, MAX(created_at) as last_optimized FROM optimizations GROUP BY asin ORDER BY last_optimized DESC';
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error('Failed to get unique ASINs:', error);
    throw new Error('Database query failed.');
  }
}

// Don't forget to export the new function
module.exports = {
  saveOptimization,
  getHistory,
  getUniqueAsins // <-- Add this here
};
