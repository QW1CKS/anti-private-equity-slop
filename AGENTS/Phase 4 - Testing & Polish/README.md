# Phase 4 - Testing & Polish

## Related Docs
- Overview: [../../README.md](../../README.md)
- Product requirements: [../../PRD.md](../../PRD.md)
- Workflow instructions: [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- Active phase state: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase checklist: [./CHECKLIST.md](./CHECKLIST.md)

## Goal
Harden extension quality through focused testing, edge-case validation, and release-readiness polish.

## Technical & Design Focus
- Expand unit and integration coverage around matching and UI behavior.
- Validate reliability across watch/shorts/live flows.
- Resolve defects discovered in previous phases.

## Agents In This Phase
- `Workflow Orchestrator`
- `Reality Checker`

## Exit Criteria
- [ ] Test coverage meets agreed threshold for critical flows.
- [ ] High/medium severity issues are resolved or documented.
- [ ] Phase evidence is complete and reproducible.

## Required Artifacts
- `AGENTS/Phase 4 - Testing & Polish/README.md`
- `AGENTS/Phase 4 - Testing & Polish/CHECKLIST.md`
- memory evidence entries in `.github/agent_memory/03_actions.tsv`

## Validation Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
