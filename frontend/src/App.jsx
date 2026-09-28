import { useState } from 'react';

const stats = [
  { label: 'Open syncs', value: '18', trend: '+6%' },
  { label: 'Awaiting approval', value: '5', trend: '2 urgent' },
  { label: 'Published this week', value: '27', trend: '+11%' },
  { label: 'Failed jobs', value: '2', trend: 'stable' },
];

const queue = [
  { name: 'Release notes sync', owner: 'Product Ops', status: 'Queued' },
  { name: 'Sprint recap publish', owner: 'Engineering', status: 'Review' },
  { name: 'Incident update', owner: 'Support', status: 'Approved' },
  { name: 'Roadmap refresh', owner: 'PMO', status: 'Queued' },
];

const defaultForm = {
  name: 'Release notes sync',
  jiraProject: 'PROJ',
  confluenceSpace: 'Product Ops',
};

function App() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [submittedWorkflow, setSubmittedWorkflow] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.jiraProject.trim() || !formData.confluenceSpace.trim()) {
      return;
    }

    setSubmittedWorkflow({
      name: formData.name.trim(),
      jiraProject: formData.jiraProject.trim(),
      confluenceSpace: formData.confluenceSpace.trim(),
    });
    setShowForm(false);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">JiraFlow</div>
        <nav>
          <button className="active">Dashboard</button>
          <button>Workflows</button>
          <button>Approvals</button>
          <button>Integrations</button>
          <button>Reports</button>
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations overview</p>
            <h1>Automation console</h1>
          </div>
          <button className="primary" onClick={() => setShowForm(true)}>Create workflow</button>
        </header>

        {submittedWorkflow && (
          <div className="success-banner" role="status">
            <strong>Workflow created successfully</strong>
            <span>{submittedWorkflow.name} · {submittedWorkflow.jiraProject} · {submittedWorkflow.confluenceSpace}</span>
          </div>
        )}

        {showForm ? (
          <section className="workflow-form-panel panel">
            <div className="panel-header">
              <h2>Create workflow</h2>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>

            <form className="workflow-form" onSubmit={handleSubmit}>
              <label>
                Workflow name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter workflow name"
                />
              </label>

              <label>
                Jira project key
                <input
                  type="text"
                  name="jiraProject"
                  value={formData.jiraProject}
                  onChange={handleChange}
                  placeholder="PROJ"
                />
              </label>

              <label>
                Confluence space
                <input
                  type="text"
                  name="confluenceSpace"
                  value={formData.confluenceSpace}
                  onChange={handleChange}
                  placeholder="Product Ops"
                />
              </label>

              <button type="submit" className="primary submit-button">Submit workflow</button>
            </form>
          </section>
        ) : (
          <>
            <section className="stats-grid">
              {stats.map((stat) => (
                <article key={stat.label} className="stat-card">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.trend}</small>
                </article>
              ))}
            </section>

            <section className="content-grid">
              <article className="panel">
                <div className="panel-header">
                  <h2>Publish queue</h2>
                  <button>View all</button>
                </div>
                <ul className="queue-list">
                  {queue.map((item) => (
                    <li key={item.name}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.owner}</span>
                      </div>
                      <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="panel">
                <div className="panel-header">
                  <h2>Sync health</h2>
                  <button>Refresh</button>
                </div>
                <div className="health-chart">
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                  <div className="bar bar-4"></div>
                  <div className="bar bar-5"></div>
                </div>
                <ul className="mini-metrics">
                  <li><span>Jira</span><strong>Healthy</strong></li>
                  <li><span>Confluence</span><strong>Healthy</strong></li>
                  <li><span>Latency</span><strong>214 ms</strong></li>
                </ul>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
