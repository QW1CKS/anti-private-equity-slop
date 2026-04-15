# Phase 5 Checklist - Launch

## Phase Goal
Prepare the extension for release with verification, packaging, and maintenance workflows in place.

## Key Deliverables
- [ ] Release package and installation path.
- [ ] Maintenance and rollback documentation.

---

## Agent 1 - `.github/agents/agents-orchestrator.agent.md`
### Actions
- [ ] Break phase down into checkpoints.
- [ ] Define precise done criteria for each item.
- [ ] Assign ownership of elements to subsequent agents.

### Outputs
- [ ] Status columns and checklist criteria created below.

### Exit Checks
- [ ] Checkpoints approved and sequential agent execution planned.

---

## Agent 2 - `.github/agents/devops-automator.agent.md`
### Actions
- [ ] Define packaging, CI/CD, and release controls.
- [ ] Document rollback triggers and operational guardrails.
- [ ] Keep the release path reproducible.

### Outputs
- [ ] Delivery workflow notes in the phase folder.

### Exit Checks
- [ ] Delivery automation is ready for release evidence.

---

## Agent 3 - `.github/agents/api-tester.agent.md`
### Actions
- [ ] Verify the end-to-end release path.
- [ ] Confirm critical regression coverage is still green.
- [ ] Record any remaining gaps.

### Outputs
- [ ] Release validation summary in the phase folder.

### Exit Checks
- [ ] Release behavior is reproducible locally.

---

## Agent 4 - `.github/agents/security-engineer.agent.md`
### Actions
- [ ] Reconfirm privacy boundaries and least-privilege permissions.
- [ ] Review residual-risk notes before the handoff.
- [ ] Validate the public package does not broaden trust boundaries.

### Outputs
- [ ] Final security notes in the phase folder.

### Exit Checks
- [ ] No critical security concerns remain.

---

## Agent 5 - `.github/agents/reality-checker.agent.md` (Closing)
### Actions
- [ ] Validate evidence of all previous agents' outputs.
- [ ] Confirm no unresolved blockers remain.

### Outputs
- [ ] Phase exit decision ready.

### Exit Checks
- [ ] Phase is safe to close.
