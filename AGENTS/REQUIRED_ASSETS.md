# Required Assets for YouTube Private Equity Warning Extension

This file defines the required asset categories for the project based on PRD analysis and tech stack requirements.

## How To Use This File

The Asset Curator agent in Phase 3 will use this file to select appropriate agents, hooks, workflows, and skills from awesome-copilot.

## Curation Inputs
- **Repo Profile:** frontend
- **Risk Posture:** strict (privacy-first, security-critical extension)
- **Capability Priorities:** security, testing, privacy, chrome-extension
- **Tech Stack:** TypeScript, Chrome MV3, Vitest, Playwright
- **Generated At:** 2026-04-16T00:00:00Z

## Required Agent Categories

### Workflow Orchestration
- `.github/agents/agents-orchestrator.agent.md` — Always required for phase coordination

### Core Agents
- Workflow Orchestrator (agents-orchestrator)
- Critical Thinking (critical-thinking)
- API Architect (for blacklist service design)
- Chrome Extension Specialist
- TypeScript/MCP Expert
- Playwright Tester (for integration testing)
- GitHub Actions Expert (for CI/CD)

### Reasoning for Selection
- **privacy-first architecture** — All matching must be local, no data leakage
- **Chrome MV3** — Service worker background, manifest V3
- **TypeScript** — Type safety required for extension reliability
- **testing** — Vitest + Playwright for unit and integration tests

## Required Hook Categories

- Pre-commit hooks for linting and formatting
- CI validation hooks for PR checks

## Required Workflow Categories

- CI/CD workflow for build/test/lint
- Code quality workflow

## Required Skills Categories

- TypeScript development
- Chrome Extension APIs
- Security/privacy best practices

## Required Instructions Categories

- Code review guidelines
- Testing standards
- Security guidelines for extensions

## Excluded (Not Needed)
- Backend agents (no server-side code in this project)
- Mobile development agents
- Database agents (using Chrome storage only)
- Payment/analytics agents (privacy-first, no tracking)

---
*This file is used by the Asset Curator agent in Phase 3 to select appropriate assets from awesome-copilot*