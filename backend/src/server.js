const express = require('express');
const config = require('./config/env');
const healthRouter = require('./routes/health');

const app = express();

app.use(express.json());
app.use('/api', healthRouter);

app.get('/', (req, res) => {
  res.json({
    name: 'Jira Confluence Automation Hub',
    status: 'running',
    version: '0.1.0'
  });
});

app.listen(config.PORT, () => {
  console.log(`Backend listening on port ${config.PORT}`);
});

module.exports = app;
