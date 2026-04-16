# Phase 4 - Testing & Polish

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
Implement comprehensive testing including unit tests, integration tests with Playwright, manual testing, and security hardening with CSP verification.

## Technical & Design Focus
- Unit tests for normalization, matching, cache, and schema validation
- Integration tests simulating YouTube SPA navigation
- Manual edge case testing (renames, redirects, offline mode)
- CSP enforcement and security verification

## Agents In This Phase
- `.github/agents/gem-orchestrator.agent.md` - Workflow orchestration and phase coordination
- `.github/agents/critical-thinking.agent.md` - Test strategy and security analysis
- `.github/agents/playwright-tester.agent.md` - Integration test implementation
- `.github/agents/typescript-mcp-expert.agent.md` - Unit test setup with Vitest

## Exit Criteria
- [ ] Unit tests pass for normalization and matching logic
- [ ] Integration tests confirm banner appears correctly
- [ ] Manual testing covers edge cases (channel rename, custom URLs, offline)
- [ ] CSP blocks remote code and inline scripts
- [ ] Extension loads without errors in Chrome

## Required Artifacts
- `tests/unit/*` — Unit tests for normalization, matching, cache, schema
- `tests/integration/*` — Playwright extension harness tests
- Security verification documentation

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