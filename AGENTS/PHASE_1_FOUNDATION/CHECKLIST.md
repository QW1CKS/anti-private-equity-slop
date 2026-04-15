# Phase 1 Checklist - Foundation

## Phase Goal
Bootstrap the workflow scaffold and document the extension foundation so feature phases can proceed without ambiguity.

## Key Deliverables
- [x] `AGENTS/` state files initialized from the workflow template.
- [x] `.github/agents/` files materialized for the project.
- [ ] Phase 1 architecture and privacy boundaries documented from `plan.md`.
- [x] Future phase roadmap recorded in the progress dashboard.

---

## Agent 1 - `.github/agents/agents-orchestrator.agent.md`
### Actions
- [x] Open the phase with explicit scope and ownership.
- [x] Set the active phase state and agent order.
- [ ] Record phase exit criteria and evidence requirements.

### Outputs
- [x] Workflow scaffold is present in `AGENTS/` and `.github/agents/`.
- [ ] Signed-off checkpoint map for the phase.

### Exit Checks
- [x] Phase state points at the correct current and next agents.
- [ ] Handoff evidence is ready for the architect.

---

## Agent 2 - `.github/agents/software-architect.agent.md`
### Actions
- [ ] Define the MV3 architecture boundaries for the extension.
- [ ] Capture the local-only matching data flow and module ownership.
- [ ] Record the initial manifest and folder conventions.

### Outputs
- [ ] Architecture notes in the active phase folder.
- [ ] Contract summary for background/content communication.

### Exit Checks
- [ ] Architecture decisions are explicit and reviewable.

---

## Agent 3 - `.github/agents/security-engineer.agent.md`
### Actions
- [ ] Confirm the least-privilege permission set.
- [ ] Document privacy boundaries and fail-closed identity rules.
- [ ] Note threat-model concerns for blacklist matching and sync.

### Outputs
- [ ] Security notes in the active phase folder.
- [ ] Abuse cases captured for later phases.

### Exit Checks
- [ ] No browsing-data leakage paths remain unaddressed.

---

## Agent 4 - `.github/agents/reality-checker.agent.md` (Closing)
### Actions
- [ ] Verify the workflow scaffold matches the plan.
- [ ] Confirm the phase evidence is sufficient to hand off.
- [ ] Flag any remaining blockers.

### Outputs
- [ ] `ACTIVE_PHASE.md` and `PROGRESS_DASHBOARD.md` remain consistent.
- [ ] Residual work is clearly bounded.

### Exit Checks
- [ ] Current phase is ready for the next agentic step.
