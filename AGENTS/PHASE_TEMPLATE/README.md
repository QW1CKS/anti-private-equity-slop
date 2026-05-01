# Phase 1 - Foundation

**🚨 CRITICAL: Every agent MUST follow these rules — NO EXCEPTIONS**

## Agent Scope Rules
1. **ONLY do tasks under YOUR agent section** — Do NOT do tasks from other agents' sections
2. **Load ALL memory files BEFORE any task** — Not optional, MANDATORY
3. **Write to memory AFTER every action** — Not optional, MANDATORY
4. **Load copilot-instructions.md FIRST** — Before any other file

## Related Docs

- Overview: [../../README.md](../../README.md)
- Installation guide: [../../INSTALLATION.md](../../INSTALLATION.md)
- Product requirements template: [../../PRD.md](../../PRD.md)
- Universal execution protocol: [../../prompt.md](../../prompt.md)
- Copilot workflow contract template: [../../.github_templates/copilot-instructions.md](../../.github_templates/copilot-instructions.md)
- Active phase state template: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard template: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase checklist template: [./CHECKLIST.md](./CHECKLIST.md)

## Goal
Phase 1 - Foundation

## Technical & Design Focus
Phase 1 - Foundation

## Agents In This Phase
- `.github/agents/agents-orchestrator.agent.md`
- `AGENTS/agents-orchestrator.agent.md`
- `AGENTS/agents-orchestrator.agent.md`

## Exit Criteria
- [ ] Product Requirements Document (PRD)
- [ ] TBD
- [ ] TBD

## Required Artifacts
- AGENTS/agents-orchestrator.agent.md
- AGENTS/agents-orchestrator.agent.md

## Validation Commands
- Build: TBD
- Test: TBD
- Lint: TBD

---

## 🚨 MANDATORY PRE-FLIGHT: BEFORE ANY TASK

**You MUST do this BEFORE doing ANY work:**

### Step 1: Load copilot-instructions.md (ALWAYS FIRST)
```powershell
cat .github/copilot-instructions.md
```

### Step 2: Load Memory Files (ALL REQUIRED)
```powershell
# Core memory
cat .github/agent_memory/00_index.md
cat .github/agent_memory/01_decisions.md
cat .github/agent_memory/02_learnings.md
cat .github/agent_memory/03_actions.tsv
cat .github/agent_memory/04_blockers.md
cat .github/agent_memory/05_handoffs.tsv
cat .github/agent_memory/06_memory_health.md
# Catalogs
cat .github/agentic_brain/catalog/awesome-catalog.yaml
cat .github/agentic_brain/catalog/required-assets.yaml
# Phase docs
cat AGENTS/ACTIVE_PHASE.md
cat AGENTS/PROGRESS_DASHBOARD.md
cat AGENTS/Phase 1 - Foundation/README.md
cat AGENTS/Phase 1 - Foundation/CHECKLIST.md
```

### Step 3: Identify Your Scope
- Find YOUR agent section in CHECKLIST.md
- ONLY do tasks listed under YOUR section
- Do NOT do tasks from other agents' sections

**Output confirmation:**
```
[System] Hybrid Brain Loaded. Memory: loaded. Scope: My assigned section only.
```

---

## 🚨 MANDATORY MEMORY WRITE: AFTER EVERY ACTION

**After completing EACH task, you MUST:**

### 1. Append to 03_actions.tsv
```
TBD	AGENTS/agents-orchestrator.agent.md.Phase 1 - Foundation	TBD	TBD	TBD
```

### 2. If architectural decision, append to 01_decisions.md

### 3. If reusable insight, append to 02_learnings.md

### 4. If blocked, append to 04_blockers.md

### 5. If passing work, append to 05_handoffs.tsv

**NEVER finish a task without writing to memory.**

---

## Required Agent Memory Workflow
- Every agent listed in this phase must execute a silent pre-flight read before task work begins:
	- `.github/copilot-instructions.md`
	- `.github/agent_memory/00_index.md`
	- `.github/agent_memory/01_decisions.md`
	- `.github/agent_memory/02_learnings.md`
	- `.github/agent_memory/03_actions.tsv`
	- `.github/agent_memory/04_blockers.md`
	- `.github/agent_memory/05_handoffs.tsv`
	- `.github/agent_memory/06_memory_health.md`
	- `.github/agentic_brain/catalog/awesome-catalog.yaml`
	- `.github/agentic_brain/catalog/required-assets.yaml`
- Every completed agent item must perform write-after-action updates:
	- append one row to `.github/agent_memory/03_actions.tsv`,
	- append to `01_decisions.md` or `02_learnings.md` when applicable,
	- append/update `04_blockers.md` for active blockers,
	- append one row to `.github/agent_memory/05_handoffs.tsv` when ownership changes.
- If `03_actions.tsv` or `05_handoffs.tsv` exceeds 100 lines, propose a memory compression task before continuing.
- TSV files must remain strictly tab-separated, one record per line, and never use markdown table syntax.

## Evidence Contract
- Every completed checklist item in this phase must include:
	- artifact path(s),
	- verification command result summary,
	- row reference to `.github/agent_memory/03_actions.tsv`.

Return to overview: [../../README.md](../../README.md)
