# Phase 3 Checklist - UI/Feature Development

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
Implement the warning banner UI with shadow DOM injection, dismissal logic, more info page, and internationalization support.

## Key Deliverables
- [ ] Warning banner appears on matched channels
- [ ] Banner is positioned correctly and doesn't block playback
- [ ] Dismiss button closes banner and records suppression
- [ ] More info opens details page without navigating away
- [ ] i18n loads correct locale strings
- [ ] Banner is keyboard accessible and screen reader compatible

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
- [ ] Coordinate Phase 3 UI implementation tasks across all agents
- [ ] Assign ownership for banner, i18n, details page
- [ ] Verify all components integrate with content script
- [ ] Track progress against exit criteria

### Outputs
- [ ] Deliverable: Phase 3 coordination and integration verification

### Exit Checks
- [ ] All key deliverables completed
- [ ] Banner appears on matched channels without blocking playback

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append architectural decisions to `.github/agent_memory/01_decisions.md`

### Evidence
- Artifacts: Phase coordination logs
- Validation: Banner integration complete

---

## Agent - typescript-mcp-expert.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Implement src/content/warning-banner.ts - Shadow-DOM banner creation
- [ ] Implement banner styling with non-modal positioning
- [ ] Add dismiss button with local suppression storage
- [ ] Add "More info" action to open details page
- [ ] Implement src/shared/i18n.ts - Message lookup with locale fallback

### Outputs
- [ ] Deliverable: src/content/warning-banner.ts
- [ ] Deliverable: src/shared/i18n.ts
- [ ] Deliverable: public/locales/en/messages.json

### Exit Checks
- [ ] Banner appears correctly and doesn't block playback
- [ ] Dismiss works and persists suppression
- [ ] i18n loads English locale

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append implementation insights to `.github/agent_memory/02_learnings.md`

### Evidence
- Artifacts: src/content/warning-banner.ts, src/shared/i18n.ts, public/locales/en/messages.json
- Validation: Banner renders correctly

---

## Agent - critical-thinking.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Review banner accessibility (keyboard navigation, screen readers)
- [ ] Analyze shadow DOM isolation strategy
- [ ] Evaluate dismiss TTL and suppression mechanism

### Outputs
- [ ] Accessibility review notes in memory

### Exit Checks
- [ ] Banner is keyboard accessible
- [ ] Screen reader compatible
- [ ] Shadow DOM properly isolates styles

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append architectural decisions to `.github/agent_memory/01_decisions.md`

### Evidence
- Artifacts: 01_decisions.md updates
- Validation: Accessibility requirements documented
- TSV rules are mandatory for `.tsv` files:
	- use literal tab separators,
	- keep each record to one physical line,
	- do not use markdown table pipes.