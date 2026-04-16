# Phase 1 Checklist - Foundation

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
Set up the extension scaffold with MV3 manifest, minimal permission configuration, YouTube detection infrastructure, and blacklist sync base.

## Key Deliverables
- [ ] MV3 manifest.json with minimal permissions (storage, alarms, YouTube host, API host only)
- [ ] Service worker background with message router scaffolded
- [ ] YouTube page detection infrastructure in place
- [ ] Blacklist storage layer with sync base implemented
- [ ] Security floor enforced (no tabs, webRequest, notifications, or scripting in Phase 1)

## Validation Commands (from PRD metadata)
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

## Evidence Ledger Rules
- Mark `[x]` only after implementation and verification.
- Each completed action must include:
	- artifacts changed,
	- command result summary,
	- action row reference in `.github/agent_memory/03_actions.tsv`.
- Do not rewrite old evidence lines; append updates instead.

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
### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Break phase down into checkpoints.
- [ ] Coordinate agent work distribution.
- [ ] Track progress against phase goals.

### Exit Criteria
- [ ] All Phase 1 artifacts created and verified
- [ ] Phase 1 exit criteria documented in README.md
- [ ] Handoff to Phase 2 prepared

---

## Agent 2 - `.github/agents/critical-thinking.agent.md`
### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Review architecture decisions for Phase 1.
- [ ] Validate security floor compliance.
- [ ] Verify permission set matches PRD.

### Exit Criteria
- [ ] Security floor review completed
- [ ] Permission set validated against Phase 1 requirements
- [ ] Any architectural concerns documented