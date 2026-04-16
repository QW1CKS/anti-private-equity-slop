# <Project Name> Copilot Workflow Instructions

**⚠️ CRITICAL: Every agent MUST load `.github/copilot-instructions.md` at startup. NO EXCEPTIONS.**

These instructions define how Copilot agents should operate for this repository under an Agentic Workflow framework.

## Documentation Links

- Overview: [../README.md](../README.md)
- Installation guide: [../INSTALLATION.md](../INSTALLATION.md)
- Product requirements template: [../PRD_TEMPLATE.md](../PRD_TEMPLATE.md)
- Universal execution protocol: [../prompt.md](../prompt.md)
- Active phase state template: [../AGENTS_templates/ACTIVE_PHASE.md](../AGENTS_templates/ACTIVE_PHASE.md)
- Progress dashboard template: [../AGENTS_templates/PROGRESS_DASHBOARD.md](../AGENTS_templates/PROGRESS_DASHBOARD.md)
- Phase README template: [../AGENTS_templates/PHASE_TEMPLATE/README.md](../AGENTS_templates/PHASE_TEMPLATE/README.md)
- Phase checklist template: [../AGENTS_templates/PHASE_TEMPLATE/CHECKLIST.md](../AGENTS_templates/PHASE_TEMPLATE/CHECKLIST.md)

## Primary Operating Mode

- Execute strictly using a phase-driven workflow governed by `AGENTS/ACTIVE_PHASE.md`.
- Before formulating any response or execution plan, read:
  - `AGENTS/ACTIVE_PHASE.md`
  - `AGENTS/PROGRESS_DASHBOARD.md`
  - `AGENTS/<current-phase>/README.md`
  - `AGENTS/<current-phase>/CHECKLIST.md`
- Determine your identity (current agent) from the phase state and act exclusively in that role.
- If a user request falls outside the defined scope of the current phase, provide a brief explanation and route it to the backlog/ideas log. Do not pull features forward unless explicitly overridden by the prompt.

## Install Mode (Agentic Brain Bootstrap)

When user intent is "install Agentic Brain" or equivalent:
- Detect repository profile (frontend/backend/fullstack/data/infra).
- Run the scaffolding script to create basic folder structure
- Tell the user to switch to "Copilot Agentic Brain Installer" agent
- The installer agent will then complete the 3-phase installation:
  1. Phase 1: Scaffolding (already done)
  2. Phase 2: PRD & Phase Configuration
  3. Phase 3: Asset Selection & Import (agents → `.github/agents/`, hooks → `.github/hooks/`, workflows → `.github/workflows/`, skills → `.github/skills/`)

Automatic trigger (chat-driven install)

- When the user issues the exact phrase: "Install Agentic Brain for this repository." the Copilot assistant **must** perform the scaffolding step according to the following flow (no manual CLI steps required from the user):
  1. **IDENTIFY THE TARGET REPOSITORY:** The target is the workspace root where the user is working, NOT the Agentic Brain template folder. For example, if the user is in `anti-private-equity-slop/`, the target is that folder - NOT `anti-private-equity-slop/Agentic-Brain/`.
  2. Perform the Pre-Flight Memory Read (see Memory Read list below).
  3. Run the scaffolding script with EXPLICIT target path: `node scripts/scaffold-agentic-brain.mjs --target "C:\Users\user\Desktop\<actual-project-folder>"` - YOU MUST SPECIFY THE TARGET, do not rely on default or current directory.
  4. After scaffolding completes, tell the user to switch to "Copilot Agentic Brain Installer" agent
  5. Provide clear instructions that the user needs to describe their project idea/need to the installer agent

**CRITICAL: The scaffolding MUST go into the user's actual project repository, NOT into the Agentic Brain template folder. If you are inside the Agentic-Brain folder, navigate UP to the parent folder and use that as the target.**

**IMPORTANT: The scaffolding script creates empty/placeholder folders. The actual agent selection and installation happens via the "Copilot Agentic Brain Installer" agent in Phase 3 - assets MUST go to VSCode-mandated locations (`.github/agents/`, `.github/hooks/`, `.github/workflows/`, `.github/skills/`).**

Notes:
- The assistant must never write to `.github_templates/` — only to the target repository (workspace root).
- Always work OUTSIDE the Agentic Brain template folder - the target is the user's actual project repository
- After scaffolding, clearly instruct the user to switch agents for full installation

Never silently skip installer steps.

## Second Brain Memory

- When bootstrapping a project, copy `.github_templates/agent_memory/` to `.github/agent_memory/`.
- Before answering, planning, editing, or running commands, perform a silent Pre-Flight Check and read:
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

Hybrid data format protocol:
- Markdown (`.md`) for reasoning and synthesis:
  - `01_decisions.md`
  - `02_learnings.md`
  - `04_blockers.md`
- TSV (`.tsv`) for append-only telemetry:
  - `03_actions.tsv`
  - `05_handoffs.tsv`
- YAML (`.yaml`) for machine-readable catalogs:
  - `awesome-catalog.yaml`
  - `required-assets.yaml`

Write-after-action rules:
1. Append one tab-separated row to `03_actions.tsv`:
   - `Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node`
2. If architecture or tradeoff decisions changed, append to `01_decisions.md`.
3. If reusable implementation insight emerged, append to `02_learnings.md`.
4. If blocked, append/update `04_blockers.md`.
5. On ownership change, append one tab-separated row to `05_handoffs.tsv`:
   - `Timestamp\tFrom_Agent\tTo_Agent\tStatus\tNext_Action`

TSV strict compliance:
- Use literal tab separators only.
- Keep each row to one physical line.
- Never use markdown table pipes.

Append-only policy:
- Do not rewrite old rows in `03_actions.tsv` or `05_handoffs.tsv`.
- Add corrections as new entries referencing prior IDs.
- Keep blockers in `04_blockers.md` with status tags.

Memory compression policy:
- If `03_actions.tsv` or `05_handoffs.tsv` exceeds 100 lines, propose a Memory Compression Task before continuing.

## Agent Sequencing Rule

- Work strictly in the defined agent order listed in `AGENTS/ACTIVE_PHASE.md` for the current phase.
- Only fulfill checklist items mapped to the **current agent** first.
- Only transfer ownership to the next agent in sequence when your designated exit criteria have visibly and evidently passed.
- Automatically update `AGENTS/ACTIVE_PHASE.md` and `AGENTS/PROGRESS_DASHBOARD.md` whenever an official agent handoff occurs.

## Progress Tracking Rule

- Every meaningful action or code change you make must be reflected in the phase's `CHECKLIST.md`.
- **Evidence-Based Completeness:** Do not arbitrarily check off `[ ]` to `[x]`. Provide the evidence in notes (e.g. tests passed, UI component rendered) before checking.
- Document any blockers or assumptions directly in the active checklist under your agent's jurisdiction.
- Include memory evidence links for every completed checklist item.

## Delivery Rule

- DO NOT advance or initialize the next phase unless the current phase's absolute exit criteria are completely verified by the Orchestrator agent.
- If the project scope requires modification, add explicitly scoped "Change Notes" to the active checklist before attempting an undocumented architectural shift.

## Awesome-Copilot Corpus Rule

- Imported corpus location: `.github/agentic_brain/vendor/awesome-copilot/`.
- Imported scope: core subset only (`agents`, `instructions`, `skills`, `hooks`, `workflows`, `plugins`, `LICENSE`, `README.md`).
- Generated catalog location: `.github/agentic_brain/catalog/awesome-catalog.yaml`.
- Curated required set location: `.github/agentic_brain/catalog/required-assets.yaml`.
- Use required set first for execution planning, then consult full catalog when expanding coverage.

Safety boundary:
- Do not auto-enable untrusted external plugin sources.
- Preserve provenance metadata when referencing imported assets.

## MANDATORY: Every Agent MUST Load Copilot-Instructions

**THIS IS NON-NEGOTIABLE — NO EXCEPTIONS.**

Every single custom agent in this repository MUST load the `.github/copilot-instructions.md` file at startup before doing ANY other work.

This requirement applies to:
- All agents in `.github/agents/*.agent.md`
- All agents in `AGENTS/*/` subdirectories
- Any agent imported from awesome-copilot-main

**Why this matters:**
- The copilot-instructions.md file contains the core operating rules for this Agentic Brain workflow
- It defines how to read memory, how to write updates, and the phase-driven execution model
- Without loading this file, agents operate outside the intended workflow and cause inconsistencies

**Implementation:**
Add this as the FIRST step in your `Critical Startup Steps` block:
```
### Memory Read (MANDATORY - DO THIS FIRST)
- Read .github/copilot-instructions.md  <-- THIS IS REQUIRED FOR EVERY AGENT
- Read AGENTS/ACTIVE_PHASE.md
- Read AGENTS/PROGRESS_DASHBOARD.md
- Read AGENTS/<current-phase>/README.md
- Read AGENTS/<current-phase>/CHECKLIST.md
- Read .github/agent_memory/00_index.md
- Read .github/agent_memory/01_decisions.md
- Read .github/agent_memory/02_learnings.md
- Read .github/agent_memory/03_actions.tsv
- Read .github/agent_memory/04_blockers.md
- Read .github/agent_memory/05_handoffs.tsv
- Read .github/agent_memory/06_memory_health.md
- Read .github/agentic_brain/catalog/awesome-catalog.yaml
- Read .github/agentic_brain/catalog/required-assets.yaml
- If present, read AGENTS/<current-phase>/<agent-specific-file>.md
```

## Custom Agent Authoring Rule

- Any new or modified custom agent file inside `.github/agents/*.agent.md` MUST include a `Critical Startup Steps` block to force dynamic reading of phase contexts.
- This block must read exactly as:
  ```markdown
  Read AGENTS/ACTIVE_PHASE.md
  Read AGENTS/PROGRESS_DASHBOARD.md
  Read AGENTS/<current-phase>/README.md
  Read AGENTS/<current-phase>/CHECKLIST.md
  Read .github/agent_memory/00_index.md
  Read .github/agent_memory/01_decisions.md
  Read .github/agent_memory/02_learnings.md
  Read .github/agent_memory/03_actions.tsv
  Read .github/agent_memory/04_blockers.md
  Read .github/agent_memory/05_handoffs.tsv
  Read .github/agent_memory/06_memory_health.md
  Read .github/agentic_brain/catalog/awesome-catalog.yaml
  Read .github/agentic_brain/catalog/required-assets.yaml
  If present, read AGENTS/<current-phase>/<agent-specific-file>.md
  ```
- Refuse to finalize any PRs or updates merging `.agent.md` files that lack this required bootstrapping block.
