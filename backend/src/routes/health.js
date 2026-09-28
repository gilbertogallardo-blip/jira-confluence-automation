const express = require('express');
const config = require('../config/env');

const router = express.Router();

router.get('/health', (req, res) => {
  const dbStatus = config.DB_HOST ? 'configured' : 'unconfigured';

  res.status(200).json({
    status: 'ok',
    service: 'jira-confluence-automation-backend',
    environment: config.NODE_ENV,
    database: dbStatus,
    uptimeSeconds: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
