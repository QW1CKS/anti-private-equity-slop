# Phase 2 - Core Domain

## Goal
Define the blacklist data model, local matcher, and sync contracts before any feature code depends on them.

## Technical & Design Focus
- Canonical `channelId`-first matching model and alias resolution rules.
- Schema validation for remote manifests, snapshots, and cache records.
- ETag, snapshot, and delta refresh semantics with bounded stale-while-revalidate behavior.
- Cache key design and suppression record strategy.

## Agents In This Phase
- `.github/agents/agents-orchestrator.agent.md`
- `.github/agents/software-architect.agent.md`
- `.github/agents/backend-architect.agent.md`
- `.github/agents/api-tester.agent.md`
- `.github/agents/reality-checker.agent.md`

## Exit Criteria
- [ ] The blacklist schema and local cache model are documented and reviewable.
- [ ] Matcher rules and ambiguity handling are explicit.
- [ ] Validation and regression coverage are defined for the contract surface.
