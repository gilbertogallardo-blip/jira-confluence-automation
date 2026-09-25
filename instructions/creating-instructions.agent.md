# Create or Update Instructions

- Keep all project guidance in `./instructions/` as markdown files named `[verb]-[task].agent.md`.
- Use short bullet points, avoid long explanations, and keep every instruction focused on one workflow.
- Put the core workflow in the instruction file and keep the wording actionable, specific, and reusable.
- Add the new instruction to `./instructions/main.agent.md` with a one-line summary and optional Keywords.
- When updating an instruction, read the current file first and extend it incrementally instead of rewriting it wholesale.
- Preserve useful existing content, especially proven steps, guardrails, and troubleshooting notes.
- Prefer a single responsibility per file: one instruction should map to one task or workflow, not a mix of unrelated activities.
- Keep file content in English unless the team explicitly requests another language for a specific workflow.
- Use Markdown headings only when needed; otherwise keep the instruction as a simple bullet list.
- Use the catalog format below when adding a new entry:
  - `- [./instructions/example.agent.md](./example.agent.md) — one-line description.`
  - `  + Keywords: keyword1, keyword2`
- Follow the local project structure and keep changes scoped to the task.
- When the project is missing the instruction infrastructure, create the entry point and supporting setup using the current IDE and project conventions.
- For GitHub Copilot in VS Code, the entry point is `.github/copilot-instructions.md` and it should point to `./instructions/main.agent.md`.
- Load the main instruction catalog on every prompt so the project keeps its latest workflow guidance in context.
- If an instruction grows too large, split it into smaller files and link them from the main catalog.
- Use the instruction files as the source of truth for how the team works and how the project is maintained.
