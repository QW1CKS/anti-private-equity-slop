# Phase 4 Checklist - Testing & Polish

## Related Docs
- Overview: [../../README.md](../../README.md)
- Product requirements: [../../PRD.md](../../PRD.md)
- Workflow instructions: [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- Active phase state: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase README: [./README.md](./README.md)

## Phase Goal
Drive production-grade confidence by expanding test coverage, hardening edge-case behavior, and enforcing evidence-based defect closure.

## Asset-Driven Execution Order
1. Gem Orchestrator
2. Playwright Tester
3. TypeScript MCP Expert
4. Security Reviewer
5. Critical Thinking Reviewer
6. GitHub Actions Expert

## Evidence Contract (mandatory)
- [ ] Append all checkpoint actions to `.github/agent_memory/03_actions.tsv`.
- [ ] Append each handoff to `.github/agent_memory/05_handoffs.tsv`.
- [ ] Each fixed bug includes a reproducible failing condition and verification condition.
- [ ] Each checklist completion item includes artifact paths and command evidence.

## Quality Scope

### In Scope
- [ ] Test depth for sync, matching, and UI warning flows.
- [ ] Edge-case hardening and defect elimination.
- [ ] Security and reliability regression review.
- [ ] CI signal quality for build/test/lint gates.

### Out of Scope
- [ ] New feature expansion outside existing PRD goals.
- [ ] Release/store publication steps (Phase 5).

## Detailed Agent Tasks

### 1) Gem Orchestrator - Test Campaign Planning
- [ ] Define quality checkpoints: unit depth, browser behavior, security regressions, CI integrity.
- [ ] Define pass/fail thresholds for moving to deployment phase.
- [ ] Define triage priority model (critical/high/medium/low).
- [ ] Define blocker escalation path and deadline-independent closure criteria.
- [ ] Ensure each checkpoint has evidence and owner assignments.

### 2) Playwright Tester - Browser Validation Campaign
- [ ] Validate warning behavior end-to-end under real navigation sequences.
- [ ] Validate dismissal persistence and expiry behavior over realistic flows.
- [ ] Validate UI resilience during rapid navigation/DOM churn.
- [ ] Validate no broken interactions for non-blacklisted content.
- [ ] Capture screenshots/logs for every failed scenario before fix iteration.
- [ ] Re-run flaky scenarios to establish stability before closure.

### 3) TypeScript MCP Expert - Reliability Refactor Gate
- [ ] Improve type safety and guard conditions in fragile code paths discovered by tests.
- [ ] Remove dead/ambiguous logic that reduces test determinism.
- [ ] Ensure async flows have explicit and testable state transitions.
- [ ] Ensure error handling remains explicit (no silent success-shaped fallbacks).
- [ ] Ensure changes stay surgical and avoid uncontrolled architectural drift.

### 4) Security Reviewer - Regression and Threat Sweep
- [ ] Re-run targeted security review over newly touched files.
- [ ] Verify no injection, secret exposure, permission abuse, or trust-boundary regressions.
- [ ] Verify external fetch/data handling paths remain hardened under error scenarios.
- [ ] Verify dependency-related risk posture remains acceptable.
- [ ] Confirm security findings are prioritized and tracked in evidence.

### 5) Critical Thinking Reviewer - Defect Closure Challenge
- [ ] Challenge whether "fixed" defects include proof against recurrence.
- [ ] Challenge whether test additions actually cover the discovered failure mode.
- [ ] Challenge whether ignored lint/type warnings hide future regressions.
- [ ] Challenge whether CI green status reflects real product readiness or blind spots.

### 6) GitHub Actions Expert - CI Reliability Hardening
- [ ] Ensure `build.yml` remains authoritative for this phase gate.
- [ ] Review workflow for least-privilege and action pinning hardening opportunities.
- [ ] Define CI improvements for richer reporting (optional matrix, artifacts, failure diagnostics).
- [ ] Ensure branch/merge policy expectation is documented: no bypass on red checks.

## Hook-Driven Validation (Phase 4)
- [ ] Tool Guardian: no blocked destructive command attempts during debugging/refactor.
- [ ] Secrets Scanner: no leaked credentials in tests, fixtures, logs, or configs.
- [ ] Dependency License Checker: no blocked licenses introduced by test/developer dependencies.
- [ ] Session Logger: complete trace of test/fix cycles recorded for auditability.

## Skill Usage Gate (Phase 4)
- [ ] `javascript-typescript-jest`: applied to test organization, mocks, and async reliability.
- [ ] `webapp-testing`: applied to browser-level validation and failure capture.
- [ ] `security-review`: applied to vulnerability-focused regression checks.

## Defect Triage and Verification Matrix
- [ ] Critical defects: fixed and verified in same phase before closure.
- [ ] High defects: fixed or explicitly accepted with documented risk owner and mitigation.
- [ ] Medium defects: either fixed or deferred with backlog linkage and rationale.
- [ ] Low defects: documented with non-blocking disposition.
- [ ] Every resolved defect includes test evidence preventing regression.

## Exit Criteria
- [ ] Quality gates are met with evidence (unit, browser, security, CI).
- [ ] No unresolved critical defect remains.
- [ ] Phase handoff packet is complete for Deployment phase.

## Command Evidence
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
