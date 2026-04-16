# Phase 3 - Testing

## Related Docs

- Overview: [../../README.md](../../README.md)
- Installation guide: [../../INSTALLATION.md](../../INSTALLATION.md)
- Product requirements template: [../../PRD.md](../../PRD.md)
- Universal execution protocol: [../../prompt.md](../../prompt.md)
- Active phase state template: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard template: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)

## Goal
Complete unit and integration testing, address edge cases, and ensure accessibility compliance.

## Technical & Design Focus
- Unit tests for normalization, matching, cache invalidation
- Integration tests with mocked YouTube DOM
- Edge case handling (channel renames, redirects, offline mode)
- Accessibility audit (keyboard nav, screen readers, RTL)
- i18n verification

## Agents In This Phase
- `.github/agents/agents-orchestrator.agent.md`
- `.github/agents/critical-thinking.agent.md`

## Exit Criteria
- [ ] All unit tests passing
- [ ] Integration tests covering YouTube SPA navigation
- [ ] Edge cases handled (renames, redirects, ambiguous IDs)
- [ ] Accessibility audit passed
- [ ] i18n strings verified

## Required Artifacts
- `tests/unit/*` — normalization, matching, cache tests
- `tests/integration/*` — Playwright extension harness

## Validation Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`