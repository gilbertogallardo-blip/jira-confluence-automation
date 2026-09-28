const express = require('express');
const {
  createExecution,
  getExecution,
  updateExecution,
  listExecutions,
  addLog,
} = require('../data/store');

const router = express.Router();

router.post('/jira/issues/sync', (req, res) => {
  const { projectId, issueKey, trigger = 'manual', matchedRules = [] } = req.body || {};

  if (!projectId || !issueKey) {
    return res.status(400).json({ error: 'Project ID and issue key are required.' });
  }

  const execution = createExecution({ projectId, issueKey, trigger, matchedRules });

  addLog({
    level: 'info',
    message: `Triggered Jira sync for ${issueKey}`,
    projectId,
  });

  return res.status(201).json(execution);
});

router.post('/confluence/pages/preview', (req, res) => {
  const { projectId, issueKey, templateId, pageTitle } = req.body || {};

  if (!projectId || !issueKey || !templateId || !pageTitle) {
    return res.status(400).json({ error: 'Project ID, issue key, template ID, and page title are required.' });
  }

  const preview = {
    pageTitle,
    spaceKey: 'ENG',
    templateId,
    content: `# ${pageTitle}\n\n## Summary\nIssue ${issueKey} has been prepared for review.`,
    previewHash: `preview_${Math.random().toString(36).slice(2, 10)}`,
  };

  const execution = createExecution({ projectId, issueKey, trigger: 'preview', matchedRules: [templateId], preview });

  addLog({
    level: 'info',
    message: `Preview generated for ${issueKey}`,
    projectId,
  });

  return res.status(201).json({ executionId: execution.id, preview });
});

router.post('/confluence/pages/publish', (req, res) => {
  const { executionId, projectId, issueKey } = req.body || {};

  if (!executionId || !projectId || !issueKey) {
    return res.status(400).json({ error: 'Execution ID, project ID, and issue key are required.' });
  }

  const updated = updateExecution(executionId, {
    projectId,
    issueKey,
    status: 'published',
    approvalState: 'approved',
    preview: {
      pageTitle: `Published-${issueKey}`,
      spaceKey: 'ENG',
      content: `Published content for ${issueKey}`,
      previewHash: `published_${Math.random().toString(36).slice(2, 10)}`,
    },
    error: null,
  });

  if (!updated) {
    return res.status(404).json({ error: 'Execution not found.' });
  }

  addLog({
    level: 'info',
    message: `Published Confluence page for ${issueKey}`,
    projectId,
  });

  return res.status(200).json(updated);
});

router.get('/sync-executions', (req, res) => {
  return res.status(200).json({ executions: listExecutions() });
});

router.get('/sync-executions/:executionId', (req, res) => {
  const execution = getExecution(req.params.executionId);
  if (!execution) {
    return res.status(404).json({ error: 'Execution not found.' });
  }

  return res.status(200).json(execution);
});

router.post('/sync-executions/:executionId/approve', (req, res) => {
  const { decision = 'approved', approverUserId = 'user_1', comment = 'Approved by reviewer.' } = req.body || {};
  const execution = getExecution(req.params.executionId);

  if (!execution) {
    return res.status(404).json({ error: 'Execution not found.' });
  }

  const updated = updateExecution(req.params.executionId, {
    status: 'approved',
    approvalState: decision === 'approved' ? 'approved' : 'pending',
    approverUserId,
    comment,
  });

  return res.status(200).json(updated);
});

router.post('/sync-executions/:executionId/reject', (req, res) => {
  const { decision = 'rejected', approverUserId = 'user_1', comment = 'Rejected by reviewer.' } = req.body || {};
  const execution = getExecution(req.params.executionId);

  if (!execution) {
    return res.status(404).json({ error: 'Execution not found.' });
  }

  const updated = updateExecution(req.params.executionId, {
    status: 'rejected',
    approvalState: decision === 'rejected' ? 'rejected' : 'pending',
    approverUserId,
    comment,
  });

  return res.status(200).json(updated);
});

module.exports = router;
