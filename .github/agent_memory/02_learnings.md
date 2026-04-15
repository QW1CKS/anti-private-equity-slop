# Learnings

## Pre-flight and write-after-action
- Treat `.github/copilot-instructions.md` as the root contract for agent behavior.
- Read the memory index and the linked ledgers before making changes.
- After a complex bug fix, feature, or structural change, append a concise entry to the relevant memory file(s) before concluding.
- Keep the live repo and `AGENTIC_WORKFLOW/.github_templates/` in sync so the workflow can be bootstrapped cleanly.
- Use relative markdown links when connecting actions back to decisions.
- Related: [Second Brain Memory System](./01_decisions.md#second-brain-memory-system)
