const dotenv = require('dotenv');
dotenv.config();

const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';
const dbUrl = process.env.DATABASE_URL;

let connectionConfig;

if (dbUrl) {
  connectionConfig = dbUrl;
} else {
  connectionConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'octodock',
    ssl: isProduction
      ? { rejectUnauthorized: false }
      : false,
  };
}

const client = new Client(connectionConfig);

/**
 * Connect to PostgreSQL database.
 * Throws an error if the connection fails.
 */
async function connect() {
  try {
    await client.connect();
    console.info('✅  Connected to PostgreSQL database');
  } catch (err) {
    console.error('❌  Failed to connect to PostgreSQL database:\n', err);
    process.exit(1);
  }
}

/**
 * Gracefully close the database connection.
 */
async function disconnect() {
  try {
    await client.end();
    console.info('✅  PostgreSQL database connection closed');
  } catch (err) {
    console.error('❌  Error while closing PostgreSQL database connection:\n', err);
  }
}

module.exports = {
  client,
  connect,
  disconnect,
};