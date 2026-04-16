# Phase 4 - Deployment

## Related Docs

- Overview: [../../README.md](../../README.md)
- Installation guide: [../../INSTALLATION.md](../../INSTALLATION.md)
- Product requirements template: [../../PRD.md](../../PRD.md)
- Universal execution protocol: [../../prompt.md](../../prompt.md)
- Active phase state template: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard template: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)

## Goal
Prepare for Chrome Web Store release, set up API hosting, and establish curator workflow documentation.

## Technical & Design Focus
- Chrome Web Store submission preparation (screenshots, descriptions, manifest)
- Blacklist API hosting on free-tier platform
- Curator workflow for adding/removing channels
- Monitoring setup for dataset freshness and API health

## Agents In This Phase
- `.github/agents/agents-orchestrator.agent.md`
- `.github/agents/critical-thinking.agent.md`

## Exit Criteria
- [ ] Chrome Web Store assets prepared (screenshots, description, metadata)
- [ ] API hosting configured with CDN caching
- [ ] Curator documentation complete
- [ ] Monitoring and alerting configured
- [ ] Extension package validated under MV3

## Required Artifacts
- Chrome Web Store submission package
- API deployment configuration
- Curator handbook

## Validation Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`