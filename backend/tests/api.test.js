const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/server');

async function fetchJson(app, url, options = {}) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  const port = server.address().port;
  const response = await fetch(`http://127.0.0.1:${port}${url}`, options);
  const body = await response.text();

  server.close();
  return { response, body: body ? JSON.parse(body) : null };
}

test('GET /api/health returns service status', async () => {
  const app = createApp();
  const { response, body } = await fetchJson(app, '/api/health');

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.service, 'jira-confluence-automation-backend');
});

test('POST /api/projects creates a project', async () => {
  const app = createApp();
  const { response, body } = await fetchJson(app, '/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Platform Team',
      jiraProjectKey: 'PLAT',
      confluenceSpaceKey: 'ENG',
      status: 'active'
    })
  });

  assert.equal(response.status, 201);
  assert.equal(body.name, 'Platform Team');
  assert.equal(body.jiraProjectKey, 'PLAT');
  assert.ok(body.id);
});

test('GET /api/sync-executions returns an array', async () => {
  const app = createApp();
  const { response, body } = await fetchJson(app, '/api/sync-executions');

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(body.executions));
});
