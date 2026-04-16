# Phase 1 - Foundation

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
Set up the extension scaffold with MV3 manifest, minimal permission configuration, YouTube detection infrastructure, and blacklist sync base.

## Technical & Design Focus
- Chrome Manifest V3 extension architecture
- Minimal permission set (storage, alarms, YouTube host, API host only)
- Service worker background with message routing
- YouTube SPA detection infrastructure
- Basic blacklist storage and sync foundation

## Agents In This Phase
- `.github/agents/agents-orchestrator.agent.md`
- `.github/agents/critical-thinking.agent.md`

## Exit Criteria
- [ ] Extension manifest.json with MV3 and minimal permissions configured
- [ ] Service worker background with message router scaffolded
- [ ] YouTube page detection infrastructure in place
- [ ] Blacklist storage layer with sync base implemented
- [ ] Security floor enforced (no tabs, webRequest, notifications, or scripting in Phase 1)

## Required Artifacts
- `manifest.json` — MV3 manifest with minimal permissions
- `src/background/service-worker.ts` — Service worker entry point
- `src/background/message-router.ts` — Message routing between content and background
- `src/content/youtube-detector.ts` — YouTube page detection
- `src/background/blacklist-sync.ts` — Blacklist sync infrastructure

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