# Create or Update Instructions

- Follow the shared project standards in `./instructions/instruction-standards.agent.md` before creating or editing workflow guidance.
- Keep the core workflow in the instruction file and keep the wording actionable, specific, and reusable.
- Use the catalog format below when adding a new entry:
  - `- [./instructions/example.agent.md](./example.agent.md) — one-line description.`
  - `  + Keywords: keyword1, keyword2`
- Add the new instruction to `./instructions/main.agent.md` with a one-line summary and optional Keywords.
- When the project is missing the instruction infrastructure, create the entry point and supporting setup using the current IDE and project conventions.
- For GitHub Copilot in VS Code, the entry point is `.github/copilot-instructions.md` and it should point to `./instructions/main.agent.md`.
- Load the main instruction catalog on every prompt so the project keeps its latest workflow guidance in context.
- Use the instruction files as the source of truth for how the team works and how the project is maintained.
- If the workflow needs a reusable rule set, extract it into a dedicated instruction and reference it from both the relevant instruction files and the catalog.
