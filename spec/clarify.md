# Clarification Review: Jira/Confluence Automation Project

This review evaluates the current requirements in [spec/constitution.md](constitution.md) and [spec/specification.md](specification.md) from the perspective of a senior developer preparing to implement the system.

## Executive Summary

The spec is directionally strong and covers product intent, stack choices, user stories, data entities, and a high-level architecture. However, several important implementation decisions remain ambiguous or inconsistent. The biggest gaps are in:

- authentication and authorization model
- exact integration contracts for Jira and Confluence
- operational rules for retries, approvals, and deduplication
- data retention and schema lifecycle
- environment configuration and deployment behavior
- UI behavior and permission boundaries

These gaps do not prevent a prototype from being built, but they will cause scope drift, rework, and inconsistent implementation if they are not resolved before coding begins.

---

## 1. Gaps in the Requirements

### 1.1 Authentication and user model are underspecified
The spec mentions admin-only actions, role-based access, and approvers, but it does not define:

- which identity provider will be used (local auth, JWT, OAuth, SSO)
- whether the frontend and backend share the same auth model
- what a user record looks like in the database
- how Jira/Confluence credentials are associated with projects or users
- whether approval actions are tied to a human identity or a service account

This is a critical gap because the system depends on approval, admin control, and secure API credential handling.

### 1.2 External integration contract is not fully specified
The spec says the system integrates with Jira and Confluence, but it does not clearly define:

- which API version or auth mechanism is required for each
- how rate limits and quota exhaustion are handled
- what happens when an API call is partial or returns inconsistent payloads
- whether the app will support Jira Cloud, Jira Server, or both
- whether Confluence page updates are via page id, title lookup, or content payload strategies

Without this, implementation may vary by team and create hidden integration issues.

### 1.3 Sync trigger semantics are ambiguous
The system states that Jira issue updates trigger automation, but it does not clarify:

- whether events are webhook-driven, poll-based, or manually triggered
- what qualifies as a meaningful update
- whether a sync is triggered on every status change or only on approved changes
- how often polling occurs and what the polling window is
- how the app handles stale issue data when Jira changes while a page is pending review

The current wording allows multiple incompatible implementations.

### 1.4 Approval workflow is not formally defined
The spec says approval is required before publishing, but it does not define:

- which approval steps are optional vs mandatory
- whether approval is project-wide, per template, or per issue
- whether the same issue can be approved multiple times
- how approval history ties to rendered content versions
- what happens if a page is updated after approval

This is a major business rule gap and affects both UX and database design.

### 1.5 Duplicate prevention and idempotency are not operationally defined
The spec mentions deduplication, but not in implementation terms. It does not define:

- the dedupe key for a sync execution
- how idempotency is enforced across restarts and retries
- whether duplicate jobs are suppressed or allowed with warnings
- whether page updates are compared by content hash, issue key, or template version

This is a core reliability requirement and needs precise rules.

### 1.6 Data retention and archival rules are missing
The data model includes execution logs and approval records but does not define:

- how long records are kept
- when old execution data is purged
- how content versions are retained
- what happens to Confluence page history or generated previews
- whether soft delete or hard delete is used for projects or templates

Without retention rules, the database can grow without a lifecycle policy.

### 1.7 Database migration and schema governance are not described
The spec mentions PostgreSQL but does not specify:

- migration tools or versioning strategy
- whether migrations are manual or automated
- how schema changes are tested in CI
- what happens if a migration fails midway
- how database constraints and indexes are managed

This is not a minor detail; it is required for reliability in a production-ready system.

### 1.8 Deployment model is incomplete
The constitution says Docker is used, but the spec does not define:

- which services run in Docker
- how frontend, backend, and database are wired together
- whether the frontend is served via Vite dev server or a production build container
- whether environment variables are loaded from .env files or a secret manager
- how health checks and startup dependencies are handled

The current documents do not give enough to build a complete local or hosted environment.

### 1.9 UI requirements are too high-level to implement consistently
The spec lists screens, but not actual requirements for:

- layout hierarchy
- navigation flow
- empty states and error states
- required fields per screen
- accessibility requirements
- how users edit or validate generated content before publish

A screen list is useful, but it is not a sufficient product spec for frontend implementation.

### 1.10 Error handling and observability are insufficiently defined
The system says it must expose failures, but there is no precise contract for:

- error codes
- retryable vs non-retryable failures
- logging format
- alert policies
- escalation paths for repeated failures
- how a user distinguishes transient errors from configuration errors

This prevents teams from building a consistent monitoring experience.

### 1.11 Security requirements need clearer boundaries
The constitution states not to hardcode credentials, but the specification does not define:

- whether the backend is the only place that touches external API keys
- how the frontend gets access to non-sensitive data without exposing admin-level endpoints
- how tokens are refreshed or rotated
- whether user sessions expire and how they are invalidated
- what CSRF protection or request signing is required for browser clients

This creates risk for both implementation and operations.

### 1.12 The product scope is not fully bounded by business problem
The project is described as a Jira/Confluence automation platform, but the following remain unclear:

- Is this a multi-project platform or a single-team app?
- Is it targeted at engineering teams only, or also PMO / operations / documentation teams?
- Is the product expected to work with only one Jira project and one Confluence space, or many?
- Is it a dashboard and automation service, or also a content authoring tool?

The current spec mixes platform, workflow, and administration responsibilities without a definite product boundary.

---

## 2. Contradictions and Inconsistencies

### 2.1 Approval vs direct automation
The spec says automation is a primary goal and also says approval is required before publication. It does not clearly define whether the default mode is:

- review-first publication,
- automated direct publish, or
- hybrid mode depending on project configuration.

This is a direct contradiction unless project-level policy is explicitly defined.

### 2.2 Automated sync vs manual review vs manual trigger
The docs imply that Jira updates can trigger automation, but some flows also describe manual sync requests and manual approval. The system needs a clear hierarchy:

- manual trigger
- automatic trigger
- approval gate
- retry queue

Without that, each feature may be implemented differently.

### 2.3 Role-based access is mentioned, but user roles are not enumerated
The spec refers to project managers, administrators, doc owners, and approvers, but it does not define:

- exact role matrix
- permissions by route or screen
- which actions each role can perform
- whether roles are static or configurable

This is not just UX detail; it affects authorization and security design.

### 2.4 Data model says one thing, architecture insinuates another
The data model includes projects, issues, pages, rules, executions, templates, and approval records, but the application architecture does not say whether templates and rules are project-scoped, tenant-scoped, or global. The result is uncertainty around reuse and governance.

### 2.5 “No secrets committed” is good, but no implementation mechanism is specified
The constitution prohibits checking secrets into source control, but the spec does not define how secrets are provisioned in local and deployed environments. The repo has no .env or config strategy documented.

### 2.6 “preview” and “publish” are not consistently modeled
Some sections describe generated previews, while others describe direct updates to Confluence pages. The spec never clarifies whether a published page is always created from a preview, or whether preview is optional for some projects.

---

## 3. Unclear Requirements That Need Resolution

The following items should be clarified before implementation begins:

1. What is the exact user role model?
2. What is the exact authentication approach?
3. What Jira products and Confluence product versions are supported?
4. Are syncs webhook-driven, scheduled, or both?
5. Is approval mandatory for all updates or only specific projects?
6. What is the exact content conflict strategy when Jira and Confluence differ?
7. What is the deduplication key for issues and page updates?
8. Are there any tenant or multi-organization requirements?
9. What is the maximum expected scale per project and per environment?
10. What is the expected retry policy for transient failures?
11. What is the schema migration strategy for PostgreSQL?
12. Is there a requirement for backup, restore, and disaster recovery?
13. What is the minimum Jira and Confluence field set required to generate a page?
14. What is the precise page overwrite policy for content already modified by a human?
15. How do users request manual refresh or resync of a page?
16. What are the readiness criteria for a project to move from draft to active production use?

---

## 4. Missing Operational Requirements

The current spec does not define enough operational detail for a production-quality integration system. Important missing items include:

- service health checks
- alert thresholds and stale status detection
- retry/backoff policy with maximum attempts
- rate-limit handling and queue behavior
- support for partial failure recovery
- security logging and audit retention
- concurrency controls for project updates
- dependency health checks for Jira/Confluence connectivity
- downtime and rollback procedures

---

## 5. Recommended Clarification Questions

These are the highest-priority questions to resolve before implementation:

1. Is the system intended to require human approval before every Confluence publish, or only for some project types?
2. Will the system use Jira webhooks, polling, or both?
3. Which auth model will be used for app users and external integrations?
4. Do we support only Jira Cloud and Confluence Cloud, or also server/on-prem versions?
5. What is the required role model: admin, reviewer, editor, viewer?
6. What data is required from Jira to render a valid Confluence page?
7. What is the deduplication and retry policy for duplicate issue events?
8. Does the product support multiple Jira projects and multiple Confluence spaces per deployment?
9. What is the expected retention policy for execution logs and page history?
10. Are we building MVP only, or do we need production-ready operational patterns in the first release?

---

## 6. Suggested Next Step

Before coding begins, the team should produce a short decision brief that resolves the above questions. The most important decisions are:

- approval policy
- auth model
- sync triggering approach
- retry/dedupe policy
- project scope and supported environments

Once those are defined, the spec should be updated in a single pass to remove ambiguity and align the architecture, API contracts, and UI behavior.
