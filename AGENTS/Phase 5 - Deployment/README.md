# Phase 5 - Deployment

## Related Docs
- Overview: [../../README.md](../../README.md)
- Product requirements: [../../PRD.md](../../PRD.md)
- Workflow instructions: [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- Active phase state: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase checklist: [./CHECKLIST.md](./CHECKLIST.md)

## Goal
Prepare and execute release workflow for extension packaging and launch readiness.

## Technical & Design Focus
- Build reproducible release artifacts.
- Validate Chrome Web Store submission requirements.
- Confirm post-release monitoring and maintenance loop.

## Agents In This Phase
- `Workflow Orchestrator`
- `Reality Checker`

## Exit Criteria
- [ ] Release package process is documented and repeatable.
- [ ] Required compliance/review items are complete.
- [ ] Handoff to maintenance mode is documented.

## Required Artifacts
- `AGENTS/Phase 5 - Deployment/README.md`
- `AGENTS/Phase 5 - Deployment/CHECKLIST.md`
- memory evidence entries in `.github/agent_memory/03_actions.tsv`

## Validation Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
