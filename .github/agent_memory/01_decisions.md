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
