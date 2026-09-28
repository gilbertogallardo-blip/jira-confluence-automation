const express = require('express');
const { getLogs } = require('../data/store');

const router = express.Router();

router.get('/monitoring/logs', (req, res) => {
  res.status(200).json({ logs: getLogs() });
});

module.exports = router;
