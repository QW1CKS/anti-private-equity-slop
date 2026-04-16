# Phase 3 - UI/Feature Development

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
Implement the warning banner UI with shadow DOM injection, dismissal logic, more info page, and internationalization support.

## Technical & Design Focus
- Shadow DOM banner injection for CSS isolation
- Non-modal, accessible warning design
- Dismissal persistence with TTL
- More info page for curated evidence display
- i18n message catalogs with locale fallback

## Agents In This Phase
- `.github/agents/gem-orchestrator.agent.md` - Workflow orchestration and phase coordination
- `.github/agents/critical-thinking.agent.md` - UI/UX design decision analysis
- `.github/agents/typescript-mcp-expert.agent.md` - TypeScript implementation for banner and i18n

## Exit Criteria
- [ ] Warning banner appears on matched channels
- [ ] Banner is positioned correctly and doesn't block playback
- [ ] Dismiss button closes banner and records suppression
- [ ] More info opens details page without navigating away
- [ ] i18n loads correct locale strings
- [ ] Banner is keyboard accessible and screen reader compatible

## Required Artifacts
- `src/content/warning-banner.ts` — Shadow-DOM banner creation and management
- `src/pages/details.ts` — Extension details page for source links
- `public/locales/en/messages.json` — English message catalog
- `public/locales/{locale}/messages.json` — Additional locale catalogs

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