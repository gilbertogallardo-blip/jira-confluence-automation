- Create process flow generation for current-state and target-state business steps.
- Input format:
  + Accept a normalized request object or structured markdown block containing at minimum: request ID, business objective, process name, module, actors, current-state summary, target-state summary, assumptions, constraints, and related systems.
  + When source data is extracted from Jira, normalize it into a consistent structure before generating the flow.
  + Include explicit step sequences for both states so the model can compare before and after behavior.
- Processing steps:
  + Identify the core business process, primary actors, system touchpoints, and dependency boundaries.
  + Build the current-state flow from existing steps, decisions, handoffs, approvals, and system interactions in chronological order.
  + Build the target-state flow from the approved future process, showing the intended end-to-end sequence and any redesigned controls.
  + Compare the two flows and highlight delta points such as new approval gates, removed steps, reordered actions, or new integrations.
  + Capture decision points, exceptions, and handoffs without inventing workflow details that are not supported by the input.
  + Keep the sequence traceable to the originating request and aligned to SAP business context.
- Output format:
  + Provide a section named `Process Flow` with two subsections: `Current State` and `Target State`.
  + Use either a numbered business-step list or a Mermaid `flowchart` block when diagram rendering is supported.
  + For each state, list steps in order with actor, action, system, and expected outcome.
  + Add a brief `Gap Summary` that describes the main differences between current and target states.
- Constraints:
  + Do not invent missing process steps, actors, or system interactions.
  + Do not merge current-state and target-state flows into one diagram; keep them separate and explicit.
  + Keep the flow concise and reviewable; prefer 5 to 12 meaningful steps unless the process requires more detail.
  + Mark missing or uncertain information as `Needs validation` rather than guessing.
  + Preserve business intent, approval logic, and SAP process semantics without adding non-functional or speculative details.
  + Ensure the output is suitable for a functional reviewer and supports downstream specification generation.
