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
Set up the foundational architecture for the Chrome MV3 extension including manifest configuration, service worker skeleton, and basic project structure with tooling.

## Technical & Design Focus
- Manifest V3 configuration with minimal permission set
- Service worker as background handler
- TypeScript project setup with build tooling
- Basic YouTube URL matching for page detection
- Project folder structure for content scripts, background, and shared code

## Agents In This Phase
- `.github/agents/gem-orchestrator.agent.md` - Workflow orchestration and phase coordination
- `.github/agents/critical-thinking.agent.md` - Architecture and design decision analysis
- `.github/agents/typescript-mcp-expert.agent.md` - TypeScript project setup and type safety implementation
- `.github/agents/github-actions-expert.agent.md` - CI/CD workflow setup for build/test/lint

## Exit Criteria
- [ ] Manifest V3 configured with minimal permissions (storage, alarms, YouTube host permissions)
- [ ] Service worker skeleton created and loads in Chrome
- [ ] TypeScript project compiles without errors
- [ ] Basic content script loads on YouTube watch/shorts/live pages
- [ ] Project folder structure follows planned architecture

## Required Artifacts
- `manifest.json` — MV3 manifest with permissions and content script registration
- `src/background/service-worker.ts` — Background service worker entry point
- `src/content/youtube-detector.ts` — Basic YouTube page URL detection
- `tsconfig.json` — TypeScript configuration
- `package.json` — Project dependencies and scripts
- `vite.config.ts` — Build configuration for extension bundling

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