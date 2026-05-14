# Learnings

## Pre-flight and write-after-action
- **ID:** LEA-20260416-001
- Read the memory index before changing anything.
- Keep decisions, learnings, and actions cross-linked with relative links.
- Append action rows to `03_actions.tsv` after meaningful work so the ledger stays current.
- Mirror the memory files in `AGENTIC_WORKFLOW/.github_templates/` and the live `.github/agent_memory/` folder.
- Related: [Memory Graph Contract](./01_decisions.md#memory-graph-contract)

## Curated asset reflection drift check
- **ID:** LEA-20260508-002
- During section-level validation, compare `AGENTS/REQUIRED_CUSTOM_AGENTS.md` against both runtime `.github/agents/` and phase checklist baseline.
- A missing doc reference (`playwright-tester`) can exist even when files are correctly installed.
- Validation should fail closed on documentation mismatch, then patch checklist baseline before marking section complete.
- Related: [Curated Asset Source-of-Truth Decision](./01_decisions.md#curated-asset-source-of-truth-decision-2026-05-08)

## UI browser-flow verification without MCP runtime
- **ID:** LEA-20260514-003
- When Playwright MCP runtime/browser harness is unavailable, a deterministic `jsdom` interaction suite can still validate warning-banner UI contracts for show/hide, dismiss-vs-close semantics, details action wiring, and SPA-style DOM resets.
- Keep this fallback explicitly documented as browser-like verification and preserve build/test/lint command evidence to avoid overstating true extension-in-Chromium coverage.
- Related: [Action ledger](./03_actions.tsv)

## UI render-sink hardening pattern
- **ID:** LEA-20260514-004
- In extension content scripts, keep template HTML static and set localized/user-adjacent values via `textContent` or vetted attributes after render; this avoids latent XSS risk from future i18n/catalog changes.
- Pair this with sender trust checks in service-worker message handlers so privileged routes (`OPEN_DETAILS_PAGE`, `CHECK_CHANNEL`) are bounded by expected origin context.
- Related: [Action ledger](./03_actions.tsv)

## Learning Entry Template
- **ID:** LEA-YYYYMMDD-XXX
- **Date:** TBD
- **Learning:** TBD
- **Source:** TBD
- **Validation:** TBD
- **Related:** TBD
