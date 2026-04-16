# Phase 2 - Core Implementation

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
Implement the core blacklist sync service, channel identifier extraction/normalization, local matching logic, and message routing between content scripts and background service worker.

## Technical & Design Focus
- Blacklist sync with manifest, snapshot, and delta support
- Cryptographic signature verification
- Channel identifier normalization (channelId, handles, custom URLs, historic names)
- ETag-based caching with stale-while-revalidate semantics
- Message protocol between content and background scripts

## Agents In This Phase
- `.github/agents/gem-orchestrator.agent.md` - Workflow orchestration and phase coordination
- `.github/agents/critical-thinking.agent.md` - Architecture and design decision analysis
- `.github/agents/api-architect.agent.md` - Blacklist API service design and data architecture
- `.github/agents/typescript-mcp-expert.agent.md` - TypeScript implementation for sync and matching
- `.github/agents/playwright-tester.agent.md` - Integration testing for YouTube detection

## Exit Criteria
- [ ] Blacklist sync service fetches and verifies remote blacklist
- [ ] Channel identifier extraction works for YouTube watch, shorts, and live pages
- [ ] Normalization handles handles, custom URLs, and path aliases correctly
- [ ] Local matching returns correct results against cached blacklist
- [ ] Message routing correctly handles content-to-background communication
- [ ] Cache layer implements TTL and stale-while-revalidate

## Required Artifacts
- `src/background/blacklist-sync.ts` — Remote manifest/snapshot sync, ETag handling, delta application
- `src/background/message-router.ts` — Request/response glue between content scripts
- `src/content/youtube-detector.ts` — YouTube SPA event handling, URL parsing
- `src/content/channel-normalize.ts` — Canonicalization helpers for identifiers
- `src/shared/blacklist-schema.ts` — Schema validation for API payloads
- `src/shared/matcher.ts` — Local match logic, alias resolution, cache-key generation

## Validation Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

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