# Decisions

## Memory Graph Contract
- **ID:** DEC-20260416-001
- **Status:** Accepted
- **Context:** This project uses a repo-local memory graph for agent behavior and delivery history.
- **Decision:** Keep memory in `.github/agent_memory/` and mirror it in `AGENTIC_WORKFLOW/.github_templates/agent_memory/`.
- **Rationale:** Makes the workflow easy to bootstrap and keeps the record close to the codebase.
- **Related:** [Learning: pre-flight and write-after-action](./02_learnings.md#pre-flight-and-write-after-action), [Action ledger](./03_actions.tsv)

## Decision Entry Template
- **ID:** DEC-YYYYMMDD-XXX
- **Status:** TBD
- **Date:** TBD
- **Context:** TBD
- **Decision:** TBD
- **Rationale:** TBD
- **Impacts:** TBD
- **Related:** TBD

## Install Curation Decision (2026-05-01)
- **ID:** DEC-20260501-CURATION
- **Status:** Accepted
- **Date:** 2026-05-01
- **Context:** Agentic Brain installation requires deterministic required-asset selection from the awesome-copilot core subset.
- **Decision:** Use repo profile 'fullstack' driven tag matching plus core orchestrator baseline.
- **Rationale:** Keeps installation broad while still producing a concise required set for execution order.
- **Impacts:** required-assets catalog, required custom agents matrix

## Phase 1 Checkpoint Governance Decision (2026-05-08)
- **ID:** DEC-20260508-001
- **Status:** Accepted
- **Date:** 2026-05-08
- **Context:** Phase 1 had execution tasks but no explicit checkpoint governance contract covering owner sequence, failure rollback, and evidence thresholds in one place.
- **Decision:** Define and enforce a four-checkpoint Phase 1 control model (Framework Readiness, Security Baseline, CI Baseline, Handoff Readiness) with explicit owner order, rollback rules, and mandatory command contract evidence.
- **Rationale:** Prevents ambiguous completion states and blocks premature handoff when build/test/lint or artifact evidence is incomplete.
- **Impacts:** `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `.github/agent_memory/03_actions.tsv`
- **Related:** [Action ledger](./03_actions.tsv)

## Canonical Phase Naming Decision (2026-05-08)
- **ID:** DEC-20260508-002
- **Status:** Accepted
- **Date:** 2026-05-08
- **Context:** PRD phase labels diverged from AGENTS phase naming in two entries (`UI/Feature Development`, `Deployment & Launch`), creating naming drift during checklist verification.
- **Decision:** Normalize PRD phase labels to the canonical AGENTS sequence: `Phase 1 - Foundation`, `Phase 2 - Blacklist API and Sync`, `Phase 3 - UI Development`, `Phase 4 - Testing & Polish`, `Phase 5 - Deployment`.
- **Rationale:** Keeps phase references consistent across planning, checklists, and progress reporting.
- **Impacts:** `PRD.md`, `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/PROGRESS_DASHBOARD.md`
- **Related:** [Action ledger](./03_actions.tsv)

## Curated Asset Source-of-Truth Decision (2026-05-08)
- **ID:** DEC-20260508-003
- **Status:** Accepted
- **Date:** 2026-05-08
- **Context:** Section 3 validation found documentation drift: runtime curated agent list included `playwright-tester`, but Phase 1 checklist baseline omitted that path.
- **Decision:** Treat `AGENTS/REQUIRED_CUSTOM_AGENTS.md` plus runtime `.github/agents/` as source-of-truth for curated agent reflection checks; fix checklist baseline to match this set.
- **Rationale:** Prevents false checklist pass when curated runtime inventory and phase docs diverge.
- **Impacts:** `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`
- **Related:** [Action ledger](./03_actions.tsv)

## Foundation Contract Boundary Decision (2026-05-08)
- **ID:** DEC-20260508-004
- **Status:** Accepted
- **Date:** 2026-05-08
- **Context:** Section 4 required explicit, auditable baseline contracts for blacklist sync boundaries, extension message flow, and failure semantics; these constraints were implicit in runtime files but not codified in phase docs.
- **Decision:** Define a Phase 1 contract baseline in `PRD.md` section `5.2` covering sync boundaries, message contracts, failure semantics, and in-scope/out-of-scope architecture rules.
- **Rationale:** Creates single source-of-truth contract for Phase 2 implementation and avoids behavior drift across service worker, content script, and matcher boundaries.
- **Impacts:** `PRD.md`, `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`
- **Related:** [Action ledger](./03_actions.tsv)

## Type and Runtime Baseline Decision (2026-05-13)
- **ID:** DEC-20260513-001
- **Status:** Accepted
- **Date:** 2026-05-13
- **Context:** Section 5 required explicit, auditable TypeScript and runtime-quality baseline contracts for strictness, module boundaries, payload validation, and next-phase testability.
- **Decision:** Extend `PRD.md` section `5.2` with a dedicated type/runtime baseline contract that locks strict TypeScript as a quality gate, defines `src/background`/`src/content`/`src/shared` ownership boundaries, requires runtime guard validation for untyped payloads, and codifies pure-helper testability expectations.
- **Rationale:** Prevents ambiguous implementation boundaries in Phase 2+ and keeps type/runtime safety expectations measurable at checklist and CI gates.
- **Impacts:** `PRD.md`, `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `.github/agent_memory/03_actions.tsv`, `.github/agent_memory/05_handoffs.tsv`
- **Related:** [Action ledger](./03_actions.tsv)

## Security Baseline Contract Decision (2026-05-13)
- **ID:** DEC-20260513-002
- **Status:** Accepted
- **Date:** 2026-05-13
- **Context:** Section 6 required the privacy and security baseline to be explicit enough that later phases can treat it as a release gate rather than an assumption.
- **Decision:** Extend `PRD.md` with a Phase 1 security baseline that makes local matching/no telemetry, minimum-permission MV3 posture, secrets scanning, release-blocking dependency/license/security findings, and security review evidence format explicit.
- **Rationale:** Prevents ambiguity in security signoff and makes the future phase handoff criteria auditable from the docs alone.
- **Impacts:** `PRD.md`, `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `.github/agent_memory/03_actions.tsv`, `.github/agent_memory/05_handoffs.tsv`
- **Related:** [Action ledger](./03_actions.tsv)

## CI Hardening Gate Implementation Requirement (2026-05-13)
- **ID:** DEC-20260513-003
- **Status:** Accepted
- **Date:** 2026-05-13
- **Context:** CP3 gate needed to require implemented CI hardening tasks before handoff, not just a documented roadmap.
- **Decision:** Implement CI hardening in Phase 1 (permissions, action SHA pinning, dependency review workflow, CodeQL workflow) and update CP3 gate wording to require implementation.
- **Rationale:** Removes ambiguous "done" states and ensures a concrete CI security baseline before the next agent.
- **Impacts:** `.github/workflows/build.yml`, `.github/workflows/dependency-review.yml`, `.github/workflows/codeql.yml`, `.github/workflows/README.md`, `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `AGENTS/ACTIVE_PHASE.md`
- **Related:** [Action ledger](./03_actions.tsv)
