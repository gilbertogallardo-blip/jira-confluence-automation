const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: Number(process.env.PORT || 3001),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_NAME: process.env.DB_NAME || 'jira_confluence_automation',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  JIRA_BASE_URL: process.env.JIRA_BASE_URL || '',
  JIRA_API_TOKEN: process.env.JIRA_API_TOKEN || '',
  CONFLUENCE_BASE_URL: process.env.CONFLUENCE_BASE_URL || '',
  CONFLUENCE_API_TOKEN: process.env.CONFLUENCE_API_TOKEN || ''
};
