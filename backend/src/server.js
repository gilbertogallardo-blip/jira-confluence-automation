const express = require('express');
const config = require('./config/env');
const healthRouter = require('./routes/health');
const projectsRouter = require('./routes/projects');
const syncRouter = require('./routes/sync');
const monitoringRouter = require('./routes/monitoring');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/api', healthRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api', syncRouter);
  app.use('/api', monitoringRouter);

  app.get('/', (req, res) => {
    res.json({
      name: 'Jira Confluence Automation Hub',
      status: 'running',
      version: '0.1.0'
    });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(config.PORT, () => {
    console.log(`Backend listening on port ${config.PORT}`);
  });
}

module.exports = { app: createApp(), createApp };
