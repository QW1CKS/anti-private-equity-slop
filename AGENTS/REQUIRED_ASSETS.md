# Required Custom Assets for YouTube Private Equity Warning Extension

This file defines the required asset categories for the project based on the PRD and repository profile.

## Project Metadata
- **Repo Profile:** extension | frontend
- **Primary Language:** typescript
- **Risk Posture:** strict (privacy-first)
- **Capability Priorities:** security, testing, chrome-extension patterns

## Curation Inputs
- **Repo Type:** Chrome Extension (Manifest V3)
- **Tech Stack:** TypeScript, Vitest, Playwright, Zod
- **Special Needs:** Privacy preservation, local-only matching, accessibility

## Required Asset Categories

### Required Agents
- **Workflow Orchestrator** - Always needed for phase management
- **Reality Checker** - Always needed for architecture review
- **Chrome Extension Specialist** - Based on MV3 extension profile
- **TypeScript Developer** - Based on primary language
- **Testing Specialist** - Vitest/Playwright testing required

### Required Hooks
- Pre-commit hooks (lint, format, type-check)
- CI validation hooks

### Required Instructions
- Code review guidelines specific to Chrome extensions
- Testing standards for extension integration tests

### Required Workflows
- CI/CD workflow for extension builds
- Code quality workflow (lint, type-check, test)

### Required Skills
- Chrome Extension development patterns
- TypeScript best practices
- Manifest V3 security guidelines

---

**Note:** This is a general category list. The Asset Curator in Phase 3 will match these to specific files from awesome-copilot.