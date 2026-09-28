import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/vitest';

describe('App workflow flow', () => {
  it('renders the dashboard and allows creating a workflow', () => {
    render(<App />);

    expect(screen.getByText('Automation console')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create workflow' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create workflow' }));

    expect(screen.getByRole('heading', { name: 'Create workflow' })).toBeInTheDocument();
    expect(screen.getByLabelText('Workflow name')).toBeInTheDocument();
    expect(screen.getByLabelText('Jira project key')).toBeInTheDocument();
    expect(screen.getByLabelText('Confluence space')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit workflow' })).toBeInTheDocument();
  });

  it('submits the new workflow and shows the success state', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Create workflow' }));
    fireEvent.change(screen.getByLabelText('Workflow name'), { target: { value: 'Release notes sync' } });
    fireEvent.change(screen.getByLabelText('Jira project key'), { target: { value: 'PROJ' } });
    fireEvent.change(screen.getByLabelText('Confluence space'), { target: { value: 'Product Ops' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit workflow' }));

    expect(screen.getByText('Workflow created successfully')).toBeInTheDocument();
    expect(screen.getByText('Release notes sync')).toBeInTheDocument();
  });
});
