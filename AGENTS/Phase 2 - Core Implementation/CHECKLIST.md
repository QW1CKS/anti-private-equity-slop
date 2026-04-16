# Phase 2 Checklist - Core Implementation

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
Implement the core blacklist sync service, channel identifier extraction/normalization, local matching logic, and message routing between content scripts and background service worker.

## Key Deliverables
- [ ] Blacklist sync service fetches and verifies remote blacklist
- [ ] Channel identifier extraction works for YouTube watch, shorts, and live pages
- [ ] Normalization handles handles, custom URLs, and path aliases correctly
- [ ] Local matching returns correct results against cached blacklist
- [ ] Message routing correctly handles content-to-background communication
- [ ] Cache layer implements TTL and stale-while-revalidate

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
- [ ] Coordinate Phase 2 implementation tasks across all agents
- [ ] Assign ownership for blacklist sync, channel normalization, and matching
- [ ] Verify all components integrate correctly
- [ ] Track progress against exit criteria

### Outputs
- [ ] Deliverable: Phase 2 coordination and integration verification

### Exit Checks
- [ ] All key deliverables completed
- [ ] Integration tests pass

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append architectural decisions to `.github/agent_memory/01_decisions.md`

### Evidence
- Artifacts: Phase coordination logs
- Validation: All components integrated

---

## Agent - api-architect.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Design blacklist API service architecture (manifest, snapshot, delta endpoints)
- [ ] Define data schemas for channel entries with aliases
- [ ] Specify ETag and If-None-Match caching strategy
- [ ] Design cryptographic signature verification for data integrity

### Outputs
- [ ] Deliverable: src/shared/blacklist-schema.ts - Schema validation for API payloads
- [ ] Deliverable: API design document in memory

### Exit Checks
- [ ] Schema design handles channelId, handles, custom URLs, historic names
- [ ] Signature verification approach defined

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append architectural decisions to `.github/agent_memory/01_decisions.md`

### Evidence
- Artifacts: blacklist-schema.ts, 01_decisions.md updates
- Validation: Schema design complete

---

## Agent - typescript-mcp-expert.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Implement src/background/blacklist-sync.ts - Remote sync with ETag handling
- [ ] Implement src/content/channel-normalize.ts - Canonicalization helpers
- [ ] Implement src/shared/matcher.ts - Local match logic and cache keys
- [ ] Implement src/background/message-router.ts - Content/background communication

### Outputs
- [ ] Deliverable: src/background/blacklist-sync.ts
- [ ] Deliverable: src/content/channel-normalize.ts
- [ ] Deliverable: src/shared/matcher.ts
- [ ] Deliverable: src/background/message-router.ts

### Exit Checks
- [ ] TypeScript compiles without errors
- [ ] All modules implement required interfaces

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append implementation insights to `.github/agent_memory/02_learnings.md`

### Evidence
- Artifacts: src/background/blacklist-sync.ts, src/content/channel-normalize.ts, src/shared/matcher.ts, src/background/message-router.ts
- Validation: TypeScript compilation passes

---

## Agent - playwright-tester.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Write integration tests for channel normalization (handle, custom URL, path alias)
- [ ] Write tests for blacklist matching logic
- [ ] Create test fixtures for YouTube page states

### Outputs
- [ ] Deliverable: tests/integration/channel-normalization.test.ts
- [ ] Deliverable: tests/integration/matching.test.ts

### Exit Checks
- [ ] Integration tests pass
- [ ] Coverage for all normalization cases

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append test insights to `.github/agent_memory/02_learnings.md`

### Evidence
- Artifacts: tests/integration/*.test.ts
- Validation: All tests pass

---

## Agent - critical-thinking.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Review blacklist sync architecture for privacy compliance
- [ ] Analyze channel normalization edge cases (ambiguous names, redirects)
- [ ] Evaluate cache layer design for offline capability

### Outputs
- [ ] Architectural review notes in memory

### Exit Checks
- [ ] Privacy requirements met (no channel IDs sent to server)
- [ ] All edge cases considered

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append architectural decisions to `.github/agent_memory/01_decisions.md`

### Evidence
- Artifacts: 01_decisions.md updates
- Validation: All decisions recorded
- TSV rules are mandatory for `.tsv` files:
	- use literal tab separators,
	- keep each record to one physical line,
	- do not use markdown table pipes.