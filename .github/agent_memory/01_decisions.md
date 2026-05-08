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
