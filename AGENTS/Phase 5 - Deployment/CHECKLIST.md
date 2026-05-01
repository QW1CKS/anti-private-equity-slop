# Phase 5 Checklist - Deployment

## Related Docs
- Overview: [../../README.md](../../README.md)
- Product requirements: [../../PRD.md](../../PRD.md)
- Workflow instructions: [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- Active phase state: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase README: [./README.md](./README.md)

## Phase Goal
Launch safely with repeatable packaging, verification, and support handoff.

## Key Deliverables
- [ ] Packaging and submission checklist completed.
- [ ] Release verification runbook documented.
- [ ] Maintenance and rollback notes prepared.

## Validation Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

## Agent 1 - Workflow Orchestrator
### Actions
- [ ] Confirm release prerequisites are satisfied.
- [ ] Coordinate final go/no-go decision.
- [ ] Record final phase evidence in memory logs.

## Agent 2 - Reality Checker
### Actions
- [ ] Validate all required release artifacts exist.
- [ ] Validate rollback/support readiness.
- [ ] Validate no incomplete blockers are hidden at launch.
