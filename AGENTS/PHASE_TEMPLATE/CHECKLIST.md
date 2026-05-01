# Phase TBD Checklist - Phase 1 - Foundation

**🚨 CRITICAL: Every agent MUST follow these rules — NO EXCEPTIONS**

## Agent Scope Rules
1. **ONLY do tasks under YOUR agent section** — Do NOT do tasks from other agents' sections
2. **Load ALL memory files BEFORE any task** — Not optional, MANDATORY
3. **Write to memory AFTER every action** — Not optional, MANDATORY
4. **Load copilot-instructions.md FIRST** — Before any other file
5. **DO NOT PRE-CHECK ITEMS** — All items start unchecked `[ ]`. ONLY check items when YOU actually complete that task.

## 🚨 EVIDENCE RULES: NEVER PRE-CHECK

- All checklist items start as `[ ]` (unchecked)
- ONLY check `[x]` items when YOU personally complete that task
- NEVER check items that other agents are responsible for
- Pre-checking breaks the evidence tracking system
- If you didn't do the work, leave it unchecked

## Related Docs

- Overview: [../../README.md](../../README.md)
- Installation guide: [../../INSTALLATION.md](../../INSTALLATION.md)
- Product requirements template: [../../PRD.md](../../PRD.md)
- Universal execution protocol: [../../prompt.md](../../prompt.md)
- Copilot workflow contract template: [../../.github_templates/copilot-instructions.md](../../.github_templates/copilot-instructions.md)
- Active phase state template: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard template: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase README template: [./README.md](./README.md)

## Phase Goal
Phase 1 - Foundation

## Key Deliverables
- [ ] Deliverable 1
- [ ] Deliverable 2

## Validation Commands (from PRD metadata)
- Build: TBD
- Test: TBD
- Lint: TBD

## Evidence Ledger Rules
- Mark `[x]` only after implementation and verification.
- Each completed action must include:
	- artifacts changed,
	- command result summary,
	- action row reference in `.github/agent_memory/03_actions.tsv`.
- Do not rewrite old evidence lines; append updates instead.

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
```

### Step 3: Identify Your Scope
- Find YOUR agent section in this checklist
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
- Before any task execution, perform a silent pre-flight read of:
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
- Keep memory updates append-only. Never rewrite historical action/handoff rows.
- TSV rules are mandatory for `.tsv` files:
	- use literal tab separators,
	- keep each record to one physical line,
	- do not use markdown table pipes.
- If `03_actions.tsv` or `05_handoffs.tsv` exceeds 100 lines, propose a memory compression task before continuing.

---

## Agent 1 - `.github/agents/agents-orchestrator.agent.md`

**🚨 SCOPE: ONLY do tasks listed below. Do NOT do other agents' tasks.**

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Break phase down into checkpoints.
- [ ] Define precise done criteria for each item.
- [ ] Assign ownership of elements to subsequent agents.

### Outputs
- [ ] Status columns and checklist criteria created below.

### Exit Checks
- [ ] Checkpoints approved and sequential agent execution planned.

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`:
	- `Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node`
- [ ] If architectural decisions changed, append rationale to `.github/agent_memory/01_decisions.md`.
- [ ] If reusable operational insight emerged, append to `.github/agent_memory/02_learnings.md`.
- [ ] If blocked, append/update `.github/agent_memory/04_blockers.md` and reference the impacted checklist item.

### Evidence
- Artifacts: AGENTS/agents-orchestrator.agent.md
- Validation: ## 1. Project Overview
- **Name:** YouTube Private Equity Warning Extension
- **Description:** A Chrome Manifest V3 extension that detects YouTube videos from private equity-owned channels and displays a non-modal warning banner to viewers without blocking playback. Uses a locally-cached, remotely-updated blacklist to maintain user privacy.
- **Target Audience:** YouTube users who want to identify and avoid content from private equity-owned channels
- Action Row: Phase 1 - Foundation
- Decision/Learning Link: TBD

---

## Agent 2 - `AGENTS/agents-orchestrator.agent.md`

**🚨 SCOPE: ONLY do tasks listed below. Do NOT do other agents' tasks.**

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Action task 1
- [ ] Action task 2

### Outputs
- [ ] Deliverable created in `/src/...`

### Exit Checks
- [ ] Tests and build validations pass.

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`:
	- `Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node`
- [ ] If architectural decisions changed, append rationale to `.github/agent_memory/01_decisions.md`.
- [ ] If reusable implementation insight emerged, append to `.github/agent_memory/02_learnings.md`.
- [ ] If blocked, append/update `.github/agent_memory/04_blockers.md` and reference the impacted checklist item.

### Evidence
- Artifacts: AGENTS/agents-orchestrator.agent.md
- Validation: ## 1. Project Overview
- **Name:** YouTube Private Equity Warning Extension
- **Description:** A Chrome Manifest V3 extension that detects YouTube videos from private equity-owned channels and displays a non-modal warning banner to viewers without blocking playback. Uses a locally-cached, remotely-updated blacklist to maintain user privacy.
- **Target Audience:** YouTube users who want to identify and avoid content from private equity-owned channels
- Action Row: Phase 1 - Foundation
- Decision/Learning Link: TBD

---

## Agent 3 - `.github/agents/agents-orchestrator.agent.md` (Closing)

**🚨 SCOPE: ONLY do tasks listed below. Do NOT do other agents' tasks.**

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Validate evidence of all previous agents outputs.
- [ ] Confirm no existing blockers.

### Outputs
- [ ] `ACTIVE_PHASE.md` signed off.
- [ ] `PROGRESS_DASHBOARD.md` marked completed for this phase.

### Exit Checks
- [ ] Phase exit criteria and evidence integrity validated.

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`:
	- `Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node`
- [ ] Append handoff row to `.github/agent_memory/05_handoffs.tsv`:
	- `Timestamp\tFrom_Agent\tTo_Agent\tStatus\tNext_Action`
- [ ] If unresolved blocker remains, record in `.github/agent_memory/04_blockers.md` and reference handoff status.

### Handoff Record
- Handoff Status: TBD
- Next Owner: AGENTS/agents-orchestrator.agent.md
- Handoff Row: AGENTS/agents-orchestrator.agent.md
