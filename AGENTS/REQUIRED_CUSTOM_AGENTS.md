# Required Custom Agents for YouTube Private Equity Warning Extension

This is the required custom-agent baseline for this repository.

## Curation Inputs
- **Repo Profile:** frontend (Chrome Manifest V3 + TypeScript)
- **Risk Posture:** strict
- **Capability Priorities:** privacy, security, testing, CI reliability
- **Generated At:** 2026-05-01

## Required Agents (Installed Paths)
1. `.github/agents/gem-orchestrator.agent.md`  
   Orchestrates phase sequencing, ownership, and evidence gates.
2. `.github/agents/critical-thinking.agent.md`  
   Validates assumptions, catches scope drift, and challenges weak plans.
3. `.github/agents/api-architect.agent.md`  
   Reviews sync contracts and data-shape boundaries.
4. `.github/agents/typescript-mcp-expert.agent.md`  
   Owns TypeScript quality and implementation guardrails.
5. `.github/agents/playwright-tester.agent.md`  
   Drives test strategy and browser-oriented validation guidance.
6. `.github/agents/se-security-reviewer.agent.md`  
   Reviews permissions, data handling, and extension security posture.
7. `.github/agents/github-actions-expert.agent.md`  
   Maintains CI workflow quality and reliability.
8. `.github/agents/agentic-brain-installer.agent.md`  
   Maintains framework structure and phase documentation setup.
9. `.github/agents/agentic-brain-asset-curator.agent.md`  
   Curates assets from the vendor subset into VS Code recognized paths.

## Execution Rule
- Execute phase by phase.
- Do not mark a phase complete without checklist evidence and memory entries.
- Keep all action/handoff telemetry append-only in `.github/agent_memory/*.tsv`.

## Related Docs
- Active phase: [./ACTIVE_PHASE.md](./ACTIVE_PHASE.md)
- Progress dashboard: [./PROGRESS_DASHBOARD.md](./PROGRESS_DASHBOARD.md)
- Required assets categories: [./REQUIRED_ASSETS.md](./REQUIRED_ASSETS.md)
