const makeId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const store = {
  projects: [
    {
      id: 'proj_demo',
      name: 'Platform Team',
      jiraProjectKey: 'PLAT',
      confluenceSpaceKey: 'ENG',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  templates: [
    {
      id: 'tpl_demo',
      projectId: 'proj_demo',
      name: 'Sprint Status Template',
      version: 1,
      content: '# Sprint Status\n\n## Summary\n{{summary}}\n\n## Status\n{{status}}\n\n## Assignee\n{{assignee}}',
      createdAt: new Date().toISOString(),
    },
  ],
  syncRules: [
    {
      id: 'rule_demo',
      projectId: 'proj_demo',
      name: 'Sprint Status Page Sync',
      triggerType: 'jira_issue_updated',
      sourceFieldMap: {
        summary: 'summary',
        status: 'status',
        assignee: 'assignee',
      },
      templateId: 'tpl_demo',
      conditions: {
        issueType: ['Story', 'Task'],
        statuses: ['In Progress', 'Done'],
      },
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  executions: [
    {
      id: 'exec_demo',
      projectId: 'proj_demo',
      issueKey: 'PLAT-418',
      trigger: 'manual',
      status: 'succeeded',
      matchedRules: ['rule_demo'],
      approvalState: 'approved',
      preview: {
        pageTitle: 'Sprint Status - PLAT-418',
        content: '# Sprint Status\n\nStatus: In Progress',
        spaceKey: 'ENG',
        previewHash: 'hash_demo',
      },
      error: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  logs: [
    {
      id: makeId('log'),
      level: 'info',
      message: 'Project sync initialized',
      projectId: 'proj_demo',
      createdAt: new Date().toISOString(),
    },
  ],
};

const listProjects = () => [...store.projects];
const getProject = (projectId) => store.projects.find((project) => project.id === projectId);

const createProject = ({ name, jiraProjectKey, confluenceSpaceKey, status = 'active' }) => {
  const project = {
    id: makeId('proj'),
    name,
    jiraProjectKey,
    confluenceSpaceKey,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.projects.push(project);
  return project;
};

const listTemplates = (projectId) => {
  return store.templates.filter((template) => template.projectId === projectId);
};

const createTemplate = ({ projectId, name, content, version = 1 }) => {
  const template = {
    id: makeId('tpl'),
    projectId,
    name,
    version,
    content,
    createdAt: new Date().toISOString(),
  };

  store.templates.push(template);
  return template;
};

const listSyncRules = (projectId) => {
  return store.syncRules.filter((rule) => rule.projectId === projectId);
};

const createSyncRule = ({ projectId, name, triggerType, sourceFieldMap, templateId, conditions, isActive = true }) => {
  const rule = {
    id: makeId('rule'),
    projectId,
    name,
    triggerType,
    sourceFieldMap,
    templateId,
    conditions,
    isActive,
    createdAt: new Date().toISOString(),
  };

  store.syncRules.push(rule);
  return rule;
};

const listExecutions = () => [...store.executions];

const getExecution = (executionId) => store.executions.find((execution) => execution.id === executionId);

const createExecution = ({ projectId, issueKey, trigger, matchedRules = [], preview = null }) => {
  const execution = {
    id: makeId('exec'),
    projectId,
    issueKey,
    trigger,
    status: 'queued',
    matchedRules,
    approvalState: 'pending',
    preview,
    error: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.executions.unshift(execution);
  return execution;
};

const updateExecution = (executionId, updates) => {
  const index = store.executions.findIndex((execution) => execution.id === executionId);
  if (index === -1) {
    return null;
  }

  const updated = {
    ...store.executions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  store.executions[index] = updated;
  return updated;
};

const addLog = ({ level = 'info', message, projectId = null }) => {
  const entry = {
    id: makeId('log'),
    level,
    message,
    projectId,
    createdAt: new Date().toISOString(),
  };

  store.logs.unshift(entry);
  return entry;
};

const getLogs = () => [...store.logs].slice(0, 20);

module.exports = {
  listProjects,
  getProject,
  createProject,
  listTemplates,
  createTemplate,
  listSyncRules,
  createSyncRule,
  listExecutions,
  getExecution,
  createExecution,
  updateExecution,
  addLog,
  getLogs,
};
