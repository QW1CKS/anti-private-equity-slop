# Phase 3 Checklist - Core MVP

## Phase Goal
Implement the YouTube page detector, channel resolver, local match path, and non-blocking warning banner.

## Key Deliverables
- [ ] YouTube SPA detection and page-variant support.
- [ ] Shadow-DOM warning banner with dismiss and More info actions.

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

## Agent 2 - `.github/agents/backend-architect.agent.md`
### Actions
- [ ] Implement the local matcher integration points.
- [ ] Wire the page resolver to stable channel identifiers.
- [ ] Keep all per-page matching local to cached data.

### Outputs
- [ ] Detector and matcher integration notes in the phase folder.

### Exit Checks
- [ ] Match decisions are deterministic and local-only.

---

## Agent 3 - `.github/agents/security-engineer.agent.md`
### Actions
- [ ] Validate fail-closed ambiguity handling.
- [ ] Review the banner for non-blocking behavior and privacy boundaries.
- [ ] Confirm dismissal state remains local and time-bounded.

### Outputs
- [ ] Security notes for the MVP interaction path.

### Exit Checks
- [ ] No new data exposure paths introduced.

---

## Agent 4 - `.github/agents/api-tester.agent.md`
### Actions
- [ ] Create the integration matrix for YouTube DOM states and navigation events.
- [ ] Cover repeated navigation, delayed metadata, and duplicate match suppression.
- [ ] Verify banner render and dismissal flows.

### Outputs
- [ ] Browser-test matrix and repro steps.

### Exit Checks
- [ ] MVP behavior is regression-covered.

---

## Agent 5 - `.github/agents/reality-checker.agent.md` (Closing)
### Actions
- [ ] Validate evidence of all previous agents' outputs.
- [ ] Confirm no unresolved blockers remain.

### Outputs
- [ ] Phase exit decision ready.

### Exit Checks
- [ ] Phase is safe to advance.
