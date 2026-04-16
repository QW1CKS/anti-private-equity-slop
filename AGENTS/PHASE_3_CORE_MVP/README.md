# Phase 3 - Core MVP

## Goal
Implement the YouTube page detector, channel resolver, local match path, and non-blocking warning banner.

## Technical & Design Focus
- YouTube SPA event handling and page-variant detection.
- Stable channel identification and fail-closed ambiguity handling.
- Shadow-DOM banner rendering, dismissal persistence, and More info behavior.
- Background/content-script messaging built only around local data.

## Agents In This Phase
- `.github/agents/agents-orchestrator.agent.md`
- `.github/agents/backend-architect.agent.md`
- `.github/agents/security-engineer.agent.md`
- `.github/agents/api-tester.agent.md`
- `.github/agents/reality-checker.agent.md`

## Exit Criteria
- [ ] The detector handles the supported YouTube page variants.
- [ ] The banner appears non-modally and respects dismissal.
- [ ] The local matching path does not leak browsing context to the blacklist source.
