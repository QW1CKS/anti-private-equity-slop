# Phase 4 Checklist - Testing & Polish

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
Implement comprehensive testing including unit tests, integration tests with Playwright, manual testing, and security hardening with CSP verification.

## Key Deliverables
- [ ] Unit tests pass for normalization and matching logic
- [ ] Integration tests confirm banner appears correctly
- [ ] Manual testing covers edge cases (channel rename, custom URLs, offline)
- [ ] CSP blocks remote code and inline scripts
- [ ] Extension loads without errors in Chrome

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
- [ ] Coordinate Phase 4 testing tasks across all agents
- [ ] Verify all tests pass and security checks complete
- [ ] Track test coverage and security metrics

### Outputs
- [ ] Deliverable: Phase 4 coordination and final verification

### Exit Checks
- [ ] All tests pass
- [ ] Security checks complete

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`

### Evidence
- Artifacts: Phase coordination logs
- Validation: All tests pass

---

## Agent - playwright-tester.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Implement integration tests for YouTube SPA navigation
- [ ] Test banner appears correctly on matched channels
- [ ] Test dismissal and suppression behavior
- [ ] Test edge cases: channel rename, custom URL redirect, offline mode
- [ ] Verify banner doesn't block video playback

### Outputs
- [ ] Deliverable: tests/integration/youtube-navigation.test.ts
- [ ] Deliverable: tests/integration/banner.test.ts
- [ ] Deliverable: tests/integration/edge-cases.test.ts

### Exit Checks
- [ ] All integration tests pass
- [ ] Edge cases covered

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append test insights to `.github/agent_memory/02_learnings.md`

### Evidence
- Artifacts: tests/integration/*.test.ts
- Validation: All tests pass

---

## Agent - typescript-mcp-expert.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Set up Vitest testing framework
- [ ] Write unit tests for channel normalization
- [ ] Write unit tests for blacklist matching
- [ ] Write unit tests for cache layer (TTL, stale-while-revalidate)
- [ ] Configure test coverage reporting

### Outputs
- [ ] Deliverable: tests/unit/channel-normalize.test.ts
- [ ] Deliverable: tests/unit/matcher.test.ts
- [ ] Deliverable: tests/unit/cache.test.ts

### Exit Checks
- [ ] All unit tests pass
- [ ] Coverage meets threshold

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append implementation insights to `.github/agent_memory/02_learnings.md`

### Evidence
- Artifacts: tests/unit/*.test.ts
- Validation: Unit tests pass

---

## Agent - critical-thinking.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Review extension CSP for security compliance
- [ ] Analyze privacy requirements (local-only matching, no data leakage)
- [ ] Verify shadow DOM isolation effectiveness
- [ ] Review manual test cases for edge cases

### Outputs
- [ ] Security review notes in memory

### Exit Checks
- [ ] CSP blocks remote code
- [ ] No inline scripts allowed
- [ ] Privacy requirements verified

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append architectural decisions to `.github/agent_memory/01_decisions.md`

### Evidence
- Artifacts: 01_decisions.md updates
- Validation: Security review complete
	- use literal tab separators,
	- keep each record to one physical line,
	- do not use markdown table pipes.