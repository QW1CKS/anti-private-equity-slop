# Phase 3 Checklist - UI Development

## Related Docs
- Overview: [../../README.md](../../README.md)
- Product requirements: [../../PRD.md](../../PRD.md)
- Workflow instructions: [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- Active phase state: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase README: [./README.md](./README.md)

## Phase Goal
Deliver clear, non-modal, accessible warning experiences on YouTube pages without breaking playback flow or privacy guarantees.

## Asset-Driven Execution Order
1. Gem Orchestrator
2. TypeScript MCP Expert
3. Playwright Tester
4. Security Reviewer
5. Critical Thinking Reviewer
6. GitHub Actions Expert

## Evidence Contract (mandatory)
- [ ] Append one row per completed checkpoint to `.github/agent_memory/03_actions.tsv`.
- [ ] Append one row per role handoff to `.github/agent_memory/05_handoffs.tsv`.
- [ ] Record changed artifacts for content script, banner UI, i18n files, and tests.
- [ ] Attach build/test/lint outputs to checkpoint evidence.

## UI Scope Definition

### In Scope
- [ ] Warning banner rendering lifecycle.
- [ ] Dismiss/suppress behavior correctness.
- [ ] Copy/i18n integration for warning and details affordances.
- [ ] SPA navigation correctness across watch/channel/shorts/live routes.

### Out of Scope
- [ ] Blocking playback or enforcing redirects.
- [ ] New options UX beyond required warning support.
- [ ] Deployment/store listing content work (Phase 5).

## Detailed Agent Tasks

### 1) Gem Orchestrator - UI Execution Control
- [ ] Define UI checkpoints: injection, behavior, accessibility, resilience, verification.
- [ ] Define owner/reviewer mapping per checkpoint.
- [ ] Define UI acceptance criteria tied to PRD (non-modal, informative, privacy-safe).
- [ ] Define rollback triggers for regressions in page stability or performance.
- [ ] Ensure evidence requirements are explicit for each UI checkpoint.

### 2) TypeScript MCP Expert - UI Code Quality
- [ ] Ensure warning banner state logic is explicit, typed, and side-effect controlled.
- [ ] Ensure dismissal persistence model is deterministic and bounded.
- [ ] Ensure content script navigation handling is resilient to YouTube SPA transitions.
- [ ] Ensure i18n keys and message usage are consistent and fallback-safe.
- [ ] Ensure no brittle selectors are used without fallback strategy.
- [ ] Ensure UI code paths preserve isolation and avoid polluting page scripts/styles.

### 3) Playwright Tester - Browser Behavior Verification
- [ ] Explore and document critical user flows before authoring/refining test scenarios.
- [ ] Validate banner appears for positive-match scenario.
- [ ] Validate banner does not appear for non-match scenario.
- [ ] Validate dismiss action suppresses reappearance for configured window.
- [ ] Validate close action hides UI without persisting dismissal when expected.
- [ ] Validate more-info action opens details path correctly.
- [ ] Validate behavior across watch, channel, and navigation transitions.
- [ ] Capture failure screenshots/logs for each broken flow and attach to evidence.

### 4) Security Reviewer - UI Security Gate
- [ ] Verify no unsafe HTML injection paths in banner rendering.
- [ ] Verify user-controlled data is safely handled in UI message interpolation.
- [ ] Verify content script messaging does not expose privileged operations unintentionally.
- [ ] Verify storage usage for banner state does not leak sensitive information.
- [ ] Verify no regression in extension permission or host-scope assumptions.

### 5) Critical Thinking Reviewer - UX and Logic Challenge
- [ ] Challenge assumptions around false positives and user trust in warnings.
- [ ] Challenge whether dismissal semantics are intuitive and reversible.
- [ ] Challenge whether edge navigation timing creates stale/wrong-banner risks.
- [ ] Challenge accessibility assumptions (focus, keyboard, role/label clarity).
- [ ] Challenge whether UI logic is over-coupled to unstable DOM fragments.

### 6) GitHub Actions Expert - UI CI Gate
- [ ] Ensure UI changes remain blocked on passing build/test/lint in `build.yml`.
- [ ] Ensure UI-phase regressions are surfaced with actionable CI signal quality.
- [ ] Document CI gaps for UI-specific automated verification (future enhancement list).

## Hook-Driven Validation (Phase 3)
- [ ] Tool Guardian: no destructive tool attempt during UI iteration.
- [ ] Secrets Scanner: no accidental secret exposure in UI/config/test artifacts.
- [ ] Dependency License Checker: no blocked-license additions for UI/testing dependencies.
- [ ] Session Logger: session trace present for UI test iterations and fixes.

## Skill Usage Gate (Phase 3)
- [ ] `webapp-testing`: used for browser-level interaction verification and debugging.
- [ ] `javascript-typescript-jest`: used for deterministic unit behavior around UI state logic.
- [ ] `security-review`: applied to UI message/render and content-script interaction paths.

## Test Matrix Requirements
- [ ] Unit tests for banner state helpers and dismissal windows.
- [ ] Unit tests for i18n key resolution and fallback behavior.
- [ ] Unit/integration tests for content-script-driven show/hide behavior.
- [ ] Browser-flow validations for watch page and SPA navigation transitions.
- [ ] Negative tests for no-warning conditions and stale data handling.

## Exit Criteria
- [ ] UI behavior matches PRD expectations and remains non-modal.
- [ ] Accessibility, security, and navigation resilience checks are evidence-backed.
- [ ] No unresolved blocker remains before moving to testing/polish.

## Command Evidence
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
