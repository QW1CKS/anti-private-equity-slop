# Decisions

## Second Brain Memory System
- **Status:** Accepted
- **Context:** The repo needs a durable place to store instructions, decisions, learnings, and actions across sessions.
- **Decision:** Store the memory graph in `.github/agent_memory/` and mirror the same layout in `AGENTIC_WORKFLOW/.github_templates/agent_memory/`.
- **Rationale:** Keeps the workflow local, versioned, and easy to bootstrap in new repos without depending on external state.
- **Related:** [Learning: pre-flight and write-after-action](./02_learnings.md#pre-flight-and-write-after-action), [Action log](./03_actions.md#memory-scaffold-and-instruction-update)
