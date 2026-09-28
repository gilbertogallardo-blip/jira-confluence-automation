# Constitution: Jira/Confluence Automation Project

## 1. Project Identity

### 1.1 Project name
Project Name: Jira Confluence Automation Hub

### 1.2 Purpose
This project exists to automate the coordination between Jira and Confluence so teams can create, update, and synchronize project documentation and workflow data with less manual effort, fewer errors, and faster delivery. The system supports operational clarity, governance, and reliable execution across engineering and business teams.

### 1.3 Target user
The primary users are project managers, engineering leads, documentation owners, and platform administrators who need dependable automation between issue tracking and knowledge management workflows.

### 1.4 Product intent
The product must prioritize trustworthy automation, maintainable integrations, and clear user workflows over novelty or over-engineering.

## 2. Technology Stack

- Frontend: React 18.3.x
- Build tooling: Vite 5.x
- Backend: Node.js 20 LTS
- Web framework: Express 4.x
- Database: PostgreSQL 15
- Containerization: Docker / Docker Compose
- Package manager: npm
- Runtime environment: Linux-based containerized local development, with Windows host support for local tooling

## 3. Architectural Principles

### 2.1 Frontend-first user experience
- The React 18 + Vite frontend is the primary interface for end users.
- All user workflows must be understandable, responsive, and accessible.
- Business logic must not be embedded in UI components where it can be shared, tested, or reused.
- The frontend must communicate with the backend through explicit API contracts.

### 2.2 Backend responsibility separation
- The Node.js + Express backend owns integration logic, orchestration, validation, and persistence boundaries.
- Services must be organized by domain concern, such as Jira integration, Confluence publishing, workflow orchestration, and internal automation policies.
- Business rules should be centralized and consistent instead of duplicated across clients.

### 2.3 Data integrity and transactional safety
- PostgreSQL 15 is the source of truth for operational data and workflow state.
- Data writes must validate required fields, enforce constraints, and avoid partial-state updates.
- Background automation and API sync operations must be idempotent whenever feasible to prevent duplicate work.

### 2.4 Docker-based local environment consistency
- Local development, testing, and integration validation must run through the Dockerized PostgreSQL setup and consistent service boundaries.
- Environment configuration must be explicit and reproducible.
- Changes that affect startup, dependencies, or networking must be documented and versioned.

## 4. Folder Structure Conventions

The repository must follow a clear and predictable structure to keep the frontend, backend, configuration, and documentation intentionally separated.

- /frontend/src/ — React application source code
- /frontend/src/components/ — reusable UI components
- /frontend/src/pages/ — route-level screens
- /frontend/src/features/ — domain-specific feature modules
- /frontend/src/services/ — API client and external service wrappers
- /frontend/src/hooks/ — reusable React hooks
- /frontend/src/utils/ — shared helper functions
- /backend/src/ — Express application source code
- /backend/src/routes/ — HTTP route definitions
- /backend/src/controllers/ — request handlers
- /backend/src/services/ — business logic and integration services
- /backend/src/repositories/ — database access and persistence logic
- /backend/src/middleware/ — validation, auth, logging, and error handling
- /backend/src/config/ — environment configuration and app settings
- /database/ or /docker/ — migration scripts and container configuration
- /spec/ — project constitution, specification, and related planning documents
- /docs/ — operational and developer documentation
- /tests/ — automated tests for backend, frontend, and integration flows

Folder boundaries must be respected. UI code must not contain core integration logic, and backend logic must not directly depend on UI-only patterns.

## 5. Coding Standards

### 5.1 Naming conventions
- Use PascalCase for React component files and component names.
- Use camelCase for functions, variables, and object properties.
- Use kebab-case for file names when appropriate for feature folders and non-component utilities.
- Use UPPER_SNAKE_CASE for environment variables and constants.
- Use descriptive names that reflect domain intent, not implementation details.

### 5.2 File organization
- Keep each feature or domain logically grouped in dedicated folders.
- Place route definitions, controllers, and business logic in separate backend layers.
- Keep shared utilities in dedicated utility folders rather than embedding them in feature files.
- Prefer one feature or responsibility per file when practical, and avoid large unstructured modules.

### 5.3 Frontend conventions
- Prefer functional React components with hooks.
- Keep components focused on rendering and orchestration, not business rule enforcement.
- Put API calls in dedicated services or adapters, not inside UI components.
- Validate and display all user-meaningful errors in the UI.

### 5.4 Backend conventions
- Centralize validation, error handling, and response shaping.
- Use service-layer logic for Jira/Confluence integration and orchestration.
- Keep database access behind repository or model boundaries.
- Use explicit status values and structured error payloads for automation operations.

### 5.5 Testing and quality
- Write tests for real behavior, not for mocked-only assumptions.
- Validate API contracts and integration behavior before shipping changes.
- Use small, maintainable modules that are easy to review and reason about.
- Favor explicit configuration over hidden behavior.

## 6. Product Standards

### 3.1 User value first
- Every feature must solve a concrete operational problem for Jira and Confluence users.
- Automation must reduce repetitive work, accelerate documentation updates, and improve traceability.
- Optional automation should be transparent, explainable, and easy to override when needed.

### 3.2 Simplicity over complexity
- Prefer clear, small modules over broad abstractions.
- Default to straightforward implementation patterns unless there is a strong reason for complexity.
- Avoid adding multiple layers of indirection when a direct and maintainable approach will suffice.

### 3.3 Security and trust
- Tokens, credentials, and secret configuration must be handled securely and never hardcoded into source control.
- Integration access should follow least-privilege principles.
- Auditability must be preserved for sync actions, publish events, and system mutations.

## 7. Technical Governance

### 4.1 Frontend rules
- Use React 18 patterns that support predictable rendering and maintainability.
- Keep component responsibilities focused and avoid mixing orchestration, API access, and presentation concerns.
- Validation and error handling must be visible to users without exposing raw backend failure details.

### 4.2 Backend rules
- Express services must validate incoming requests, normalize input, and handle failures explicitly.
- API responses must be structured and consistent for frontend consumption.
- Retry logic, rate limiting awareness, and timeout handling must be implemented for external Jira/Confluence calls.

### 4.3 Data rules
- PostgreSQL 15 schema changes must be intentional, reviewed, and reversible when possible.
- Data models must reflect business lifecycle states such as pending, synced, failed, or archived.
- Query patterns should be optimized for expected application usage and avoid unnecessary write amplification.

## 8. Integration and Automation Rules

### 5.1 Jira integration
- Jira synchronization must treat issue metadata, workflow status, and user context as governed state.
- Field mapping must be explicit and versioned to prevent silent drift over time.
- Sync logic must protect against duplicate or conflicting updates.

### 5.2 Confluence integration
- Confluence publishing must be deterministic and metadata-aware.
- Page generation and updates must preserve versioning expectations and editorial intent.
- Content generation must support templates, approvals, or governance checkpoints when required.

### 5.3 Event-driven operations
- Automation workflows should be observable, traceable, and resilient to partial failures.
- System actions must log enough context to diagnose failed synchronization or publish attempts.
- Long-running automation should be designed to recover without corrupting source state.

## 9. Quality Standards

- Features must be tested at the level that proves real behavior, not merely mocked interactions.
- API contracts must be verified before deployment when behavior changes.
- Frontend flows must be validated for usability and failure recovery.
- Data changes must be checked for schema compatibility and migration safety.

## 10. Development Workflow

1. Define the user problem and business outcome clearly.
2. Model the required data and process boundaries before implementation.
3. Build frontend and backend contracts together to avoid drift.
4. Implement the smallest reliable change set.
5. Validate integration behavior against realistic Jira and Confluence scenarios.
6. Document any new automation assumptions, edge cases, or operational dependencies.

## 11. Decision Rules

When there is ambiguity, the following order of precedence applies:
1. Safety and data integrity
2. User trust and clarity
3. Maintainability and consistency
4. Performance within the required product scope
5. Implementation speed

If a change increases operational risk, reduces observability, or creates undocumented integration behavior, it should not be accepted without explicit review.

## 12. Scope Boundaries

This project is limited to the automation and coordination workflows needed for Jira and Confluence operations. It does not expand into unrelated platform concerns unless they directly support the core product mission. Any added scope must be justified by user need, technical necessity, or measurable operational value.

## 13. Security and Environment Policy

### 13.1 Secret management
- All Jira, Confluence, and database credentials must be stored in environment variables or a secure secret manager, never in source code.
- Example secret names must use clear prefixes such as JIRA_, CONFLUENCE_, and DATABASE_.
- Production secrets must never be committed to the repository, logs, or test fixtures.

### 13.2 Environment separation
- Local, test, and production environments must be kept separate.
- Configuration defaults must be documented and reviewed before being promoted.
- Feature flags and environment-specific behavior must be explicit and observable.

### 13.3 Access control
- Admin-only functionality must be protected from general users.
- Read/write permissions for shared Confluence spaces and Jira projects must be validated before automation is enabled.
- Access reviews should be performed when permission models or team ownership changes.

## 14. Review and Release Policy

### 14.1 Review expectations
- All non-trivial changes must be reviewed before merge.
- API contract changes require a corresponding update to the specification and relevant tests.
- Changes affecting automation behavior or publish logic must include validation evidence.

### 14.2 Release conventions
- Releases should be small, testable, and traceable to a clear scope.
- Deployment notes must document environment variables, migration steps, and rollback guidance.
- New automation rules must be validated in a lower-risk environment before production use.

## 15. Deployment and Operations Policy

- Local development must run with Dockerized PostgreSQL and documented startup commands.
- Backend services must expose health and status endpoints for operational monitoring.
- Failed automation runs must be visible and retryable without data loss.
- Monitoring must include sync status, runtime errors, and content publication outcomes.

## 16. Amendment Policy

This constitution may evolve as product requirements mature. Any amendment must be approved by project maintainers and documented as a change to architecture, workflow, or quality expectations. Changes that affect data integrity, security, or external integration behavior require explicit review before implementation.

---

Version: 1.2
Status: Active
Stack: React 18.3.x + Vite 5.x, Node.js 20 LTS + Express 4.x, PostgreSQL 15 via Docker
