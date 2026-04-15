# Phase 1 - Foundation

## Goal
Bootstrap the workflow scaffold and lock the extension's runtime, privacy, and permission boundaries before feature code starts.

## Technical & Design Focus
- Manifest V3 shell, project layout, and module ownership.
- Local-only matching flow: content script -> background service worker -> cached blacklist.
- Minimal permissions, strict CSP, and fail-closed identity rules from `plan.md`.
- Evidence-based phase handoff and initial validation expectations.

## Agents In This Phase
- `.github/agents/agents-orchestrator.agent.md`
- `.github/agents/software-architect.agent.md`
- `.github/agents/security-engineer.agent.md`
- `.github/agents/reality-checker.agent.md`

## Exit Criteria
- [ ] `AGENTS/ACTIVE_PHASE.md` and `AGENTS/PROGRESS_DASHBOARD.md` are initialized and coherent.
- [ ] The extension foundation, permission set, and local-only data flow are documented from `plan.md`.
- [ ] The next phase boundary is explicit and blocked until this phase's evidence exists.
