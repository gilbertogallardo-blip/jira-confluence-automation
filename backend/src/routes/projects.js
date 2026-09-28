const express = require('express');
const {
  listProjects,
  getProject,
  createProject,
  listTemplates,
  createTemplate,
  listSyncRules,
  createSyncRule,
} = require('../data/store');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ projects: listProjects() });
});

router.post('/', (req, res) => {
  const { name, jiraProjectKey, confluenceSpaceKey, status } = req.body || {};

  if (!name || !jiraProjectKey || !confluenceSpaceKey) {
    return res.status(400).json({
      error: 'Project name, Jira project key, and Confluence space key are required.',
    });
  }

  const project = createProject({ name, jiraProjectKey, confluenceSpaceKey, status });
  return res.status(201).json(project);
});

router.get('/:projectId', (req, res) => {
  const project = getProject(req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  return res.status(200).json({
    ...project,
    activeRules: listSyncRules(project.id),
    templates: listTemplates(project.id),
  });
});

router.get('/:projectId/sync-rules', (req, res) => {
  const rules = listSyncRules(req.params.projectId);
  return res.status(200).json({ syncRules: rules });
});

router.post('/:projectId/sync-rules', (req, res) => {
  const { projectId } = req.params;
  const { name, triggerType, sourceFieldMap, templateId, conditions, isActive } = req.body || {};

  if (!name || !triggerType || !templateId) {
    return res.status(400).json({ error: 'Rule name, trigger type, and template are required.' });
  }

  const rule = createSyncRule({
    projectId,
    name,
    triggerType,
    sourceFieldMap: sourceFieldMap || {},
    templateId,
    conditions: conditions || {},
    isActive: isActive !== undefined ? isActive : true,
  });

  return res.status(201).json(rule);
});

router.get('/:projectId/templates', (req, res) => {
  const templates = listTemplates(req.params.projectId);
  return res.status(200).json({ templates });
});

router.post('/:projectId/templates', (req, res) => {
  const { projectId } = req.params;
  const { name, content, version } = req.body || {};

  if (!name || !content) {
    return res.status(400).json({ error: 'Template name and content are required.' });
  }

  const template = createTemplate({ projectId, name, content, version });
  return res.status(201).json(template);
});

module.exports = router;
