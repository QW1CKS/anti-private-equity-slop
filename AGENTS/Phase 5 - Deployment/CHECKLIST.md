# Phase 5 Checklist - Deployment

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
Prepare and deploy the extension to Chrome Web Store and set up the blacklist API infrastructure for ongoing maintenance.

## Key Deliverables
- [ ] Extension published to Chrome Web Store
- [ ] Blacklist API deployed and accessible
- [ ] Documentation complete (README, installation guide)
- [ ] Monitoring configured for API errors and dataset freshness

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

---

## Agent - gem-orchestrator.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Coordinate Phase 5 deployment tasks across all agents
- [ ] Verify Chrome Web Store submission
- [ ] Verify API deployment
- [ ] Verify documentation completeness

### Outputs
- [ ] Deliverable: Phase 5 coordination and final verification

### Exit Checks
- [ ] Extension published to Chrome Web Store
- [ ] API accessible

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`

### Evidence
- Artifacts: Phase coordination logs
- Validation: Deployment complete

---

## Agent - github-actions-expert.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Create release workflow for Chrome Web Store submission
- [ ] Set up version tagging automation
- [ ] Configure build artifact publishing
- [ ] Create API deployment workflow (if applicable)

### Outputs
- [ ] Deliverable: .github/workflows/release.yml
- [ ] Deliverable: API deployment configuration

### Exit Checks
- [ ] Release workflow functional
- [ ] Build artifacts ready for submission

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append deployment insights to `.github/agent_memory/02_learnings.md`

### Evidence
- Artifacts: .github/workflows/release.yml
- Validation: Workflow functional

---

## Agent - critical-thinking.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Review deployment checklist for completeness
- [ ] Verify monitoring setup for API health
- [ ] Ensure curator rules documented for blacklist maintenance

### Outputs
- [ ] Deployment review notes in memory

### Exit Checks
- [ ] Monitoring configured
- [ ] Documentation complete

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append decisions to `.github/agent_memory/01_decisions.md`

### Evidence
- Artifacts: 01_decisions.md updates
- Validation: Deployment review complete
	- keep each record to one physical line,
	- do not use markdown table pipes.