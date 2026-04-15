# <Project Name> Copilot Workflow Instructions

These instructions define how Copilot agents should operate for this repository under an Agentic Workflow framework.

## Primary Operating Mode

- Execute strictly using a phase-driven workflow governed by `AGENTS/ACTIVE_PHASE.md`.
- Before formulating any response or execution plan, read:
  - `AGENTS/ACTIVE_PHASE.md`
  - `AGENTS/PROGRESS_DASHBOARD.md`
  - `AGENTS/<current-phase>/README.md`
  - `AGENTS/<current-phase>/CHECKLIST.md`
- Determine your identity (current agent) from the phase state and act exclusively in that role.
- If a user request falls outside the defined scope of the current phase, provide a brief explanation and route it to the backlog/ideas log. Do not pull features forward unless explicitly overridden by the prompt.

## Second Brain Memory

- When bootstrapping a project, copy `AGENTIC_WORKFLOW/.github_templates/agent_memory/` to `.github/agent_memory/`.
- Before answering, planning, or editing, read:
  - `.github/agent_memory/00_index.md`
  - `.github/agent_memory/01_decisions.md`
  - `.github/agent_memory/02_learnings.md`
  - `.github/agent_memory/03_actions.md`
- Treat those files as the repo-local memory graph.
- After any complex bug fix, feature, or structural choice, append a concise entry to the relevant memory file(s) before concluding.
- Cross-link memory entries with relative markdown links so decisions, learnings, and actions stay navigable.

## Agent Sequencing Rule

- Work strictly in the defined agent order listed in `AGENTS/ACTIVE_PHASE.md` for the current phase.
- Only fulfill checklist items mapped to the **current agent** first.
- Only transfer ownership to the next agent in sequence when your designated exit criteria have visibly and evidently passed.
- Automatically update `AGENTS/ACTIVE_PHASE.md` and `AGENTS/PROGRESS_DASHBOARD.md` whenever an official agent handoff occurs.

## Progress Tracking Rule

- Every meaningful action or code change you make must be reflected in the phase's `CHECKLIST.md`.
- **Evidence-Based Completeness:** Do not arbitrarily check off `[ ]` to `[x]`. Provide the evidence in notes (e.g. tests passed, UI component rendered) before checking.
- Document any blockers or assumptions directly in the active checklist under your agent's jurisdiction.

## Delivery Rule

- DO NOT advance or initialize the next phase unless the current phase's absolute exit criteria are completely verified by the Orchestrator agent.
- If the project scope requires modification, add explicitly scoped "Change Notes" to the active checklist before attempting an undocumented architectural shift.

## Custom Agent Authoring Rule

- Any new or modified custom agent file inside `.github/agents/*.agent.md` MUST include a `Critical Startup Steps` block to force dynamic reading of phase contexts.
- This block must read exactly as:
  ```markdown
  Read AGENTS/ACTIVE_PHASE.md
  Read AGENTS/<current-phase>/README.md
  Read AGENTS/<current-phase>/CHECKLIST.md
  If present, read AGENTS/<current-phase>/<agent-specific-file>.md
  ```
- Refuse to finalize any PRs or updates merging `.agent.md` files that lack this required bootstrapping block.
