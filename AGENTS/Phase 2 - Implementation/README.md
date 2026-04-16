# Phase 2 - Implementation

## Related Docs

- Overview: [../../README.md](../../README.md)
- Installation guide: [../../INSTALLATION.md](../../INSTALLATION.md)
- Product requirements template: [../../PRD.md](../../PRD.md)
- Universal execution protocol: [../../prompt.md](../../prompt.md)
- Copilot workflow contract template: [../../.github_templates/copilot-instructions.md](../../.github_templates/copilot-instructions.md)
- Active phase state template: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard template: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase checklist template: [./CHECKLIST.md](./CHECKLIST.md)

## Goal
Implement channel identifier extraction, normalization, local matching engine, and warning banner UI with shadow DOM.

## Technical & Design Focus
- Channel identifier extraction from YouTube page (channelId, handles, custom URLs)
- Unicode NFKC normalization and canonicalization
- Local matching against cached blacklist
- Shadow-DOM warning banner with dismiss/more-info actions
- Cache result optimization to prevent re-renders

## Agents In This Phase
- `.github/agents/agents-orchestrator.agent.md`
- `.github/agents/critical-thinking.agent.md`

## Exit Criteria
- [ ] Channel identifier extraction working for all YouTube page types
- [ ] Normalization handles handles, custom URLs, legacy redirects
- [ ] Local matching returns results in <50ms
- [ ] Warning banner injected in shadow DOM, accessible, dismissible
- [ ] Dismissal with TTL suppression working

## Required Artifacts
- `src/content/channel-normalize.ts` — canonicalization helpers
- `src/shared/matcher.ts` — local match logic
- `src/content/warning-banner.ts` — shadow-DOM banner
- `src/shared/blacklist-schema.ts` — API payload validation

## Validation Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

## Evidence Contract
- Every completed checklist item must include artifact path(s), verification result, and memory reference.