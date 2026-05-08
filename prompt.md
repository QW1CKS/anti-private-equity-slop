# PHASE EXECUTION PROTOCOL

## STARTUP

Before any action, load and read:

- `.github/copilot-instructions.md`
- `.github/agent_memory/00_index.md`
- `.github/agent_memory/01_decisions.md`
- `.github/agent_memory/02_learnings.md`
- `.github/agent_memory/03_actions.tsv`
- `.github/agent_memory/04_blockers.md`
- `.github/agent_memory/05_handoffs.tsv`
- `.github/agent_memory/06_memory_health.md`
- `AGENTS/ACTIVE_PHASE.md`
- `AGENTS/PROGRESS_DASHBOARD.md`
- `AGENTS/<current-phase>/README.md`
- `AGENTS/<current-phase>/CHECKLIST.md`

If any required file is missing:
- STOP immediately
- Report the missing file

After loading, determine:
1. Current active phase
2. Current progress state
3. Remaining unchecked tasks
4. Required execution order

Then begin execution immediately.

---

# EXECUTION RULES

You must:
- Execute tasks sequentially
- Follow checklist order exactly
- Continue working until all assigned tasks are complete
- Never stop mid-phase unless blocked
- Never skip unchecked tasks
- Never execute future-phase tasks

For every completed task:
1. Implement the required changes
2. Verify results using build/test/lint commands when available
3. Update checklist status from:
   - `[ ]`
   to
   - `[x]`
4. Record changed files and verification results
5. Append action entry to:
   - `.github/agent_memory/03_actions.tsv`

If a major architectural or implementation decision is made:
- Append it to:
  - `.github/agent_memory/01_decisions.md`

If blocked:
1. Record blocker in:
   - `.github/agent_memory/04_blockers.md`
2. Stop execution
3. Output:
   - exact blocker
   - attempted actions
   - minimal required user intervention

---

# COMPLETION RULES

Do not stop execution until:
- all tasks in the current assigned checklist scope are completed
OR
- a real blocker prevents safe continuation

When phase tasks are complete:
1. Ensure all completed checklist items are marked `[x]`
2. Ensure memory/action logs are updated
3. Output a concise completion summary including:
   - completed tasks
   - files changed
   - verification status
   - remaining blockers (if any)

---

# NON-NEGOTIABLE RULES

- Memory must be read before execution
- Memory must be updated after actions
- Checklist is the source of truth
- No silent task skipping
- No phase jumping
- No partial completion reporting
- No stopping before assigned tasks are finished unless blocked