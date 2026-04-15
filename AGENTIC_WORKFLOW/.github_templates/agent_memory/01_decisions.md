# Decisions

## Memory Graph Contract
- **Status:** Accepted
- **Context:** This project uses a repo-local memory graph for agent behavior and delivery history.
- **Decision:** Keep memory in `.github/agent_memory/` and mirror it in `AGENTIC_WORKFLOW/.github_templates/agent_memory/`.
- **Rationale:** Makes the workflow easy to bootstrap and keeps the record close to the codebase.
- **Related:** [Learning: pre-flight and write-after-action](./02_learnings.md#pre-flight-and-write-after-action), [Action log template](./03_actions.md#action-log-template)
