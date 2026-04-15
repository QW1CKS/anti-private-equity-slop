# Phase 2 Checklist - Core Domain

## Phase Goal
Define the blacklist data model, local matcher, and sync contracts before any feature code depends on them.

## Key Deliverables
- [ ] Canonical blacklist schema and validation rules.
- [ ] Local matcher and alias-resolution contract.

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

## Agent 2 - `.github/agents/software-architect.agent.md`
### Actions
- [ ] Define the data model for blacklist entries, aliases, and versions.
- [ ] Specify the sync contract for snapshot and delta updates.
- [ ] Record cache and suppression-key conventions.

### Outputs
- [ ] Contract notes in the phase folder.

### Exit Checks
- [ ] Contract boundaries are stable enough for implementation.

---

## Agent 3 - `.github/agents/backend-architect.agent.md`
### Actions
- [ ] Translate the domain model into matcher-friendly structures.
- [ ] Document stale-while-revalidate and bounded-TTL behavior.
- [ ] Define local storage and broadcast expectations.

### Outputs
- [ ] Matcher and cache behavior notes in the phase folder.

### Exit Checks
- [ ] Local matching behavior is unambiguous.

---

## Agent 4 - `.github/agents/api-tester.agent.md`
### Actions
- [ ] Create a validation matrix for valid and malformed payloads.
- [ ] Cover alias resolution and ambiguity rejection cases.
- [ ] Define regression coverage for cache invalidation.

### Outputs
- [ ] Test matrix for the contract surface.

### Exit Checks
- [ ] Contract tests are specified before code arrives.

---

## Agent 5 - `.github/agents/reality-checker.agent.md` (Closing)
### Actions
- [ ] Validate evidence of all previous agents' outputs.
- [ ] Confirm no unresolved blockers remain.

### Outputs
- [ ] Phase exit decision ready.

### Exit Checks
- [ ] Phase is safe to advance.
