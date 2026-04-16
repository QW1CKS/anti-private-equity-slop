# Required Custom Agents for YouTube Private Equity Warning Extension

This is the mandatory custom-agent set for delivering the project end to end.

No optional agents should be included here.

## How To Use This File

Execute work phase by phase, and inside each phase run the listed agents in a strictly defined sequential order.

Use this operational loop for every phase:

1. Orchestrator opens the phase and sets scope, deliverables, and acceptance criteria.
2. Architecture and domain agents define the contracts and implementation boundaries.
3. Security, testing, and delivery agents validate evidence locally.
4. Orchestrator closes the phase only when all exit criteria pass.

**CRITICAL RULE:** Do not start the next phase until the current phase exit criteria are entirely met.

## Required Agents Only

1. `.github/agents/agents-orchestrator.agent.md`
**Purpose:** Coordinates all other agents, assigns ownership by phase, ensures tasks are completed via evidence, and prevents workflow gaps.

2. `.github/agents/software-architect.agent.md`
**Purpose:** Owns system-level technical decisions, module boundaries, and contracts.

3. `.github/agents/security-engineer.agent.md`
**Purpose:** Owns privacy boundaries, least-privilege decisions, and abuse-case validation.

4. `.github/agents/backend-architect.agent.md`
**Purpose:** Owns local matching, cache, and blacklist sync contracts.

5. `.github/agents/api-tester.agent.md`
**Purpose:** Verifies payload contracts, failure paths, and regression coverage.

6. `.github/agents/devops-automator.agent.md`
**Purpose:** Owns CI/CD, release automation, and environment guardrails.

7. `.github/agents/design-ux-architect.agent.md`
**Purpose:** Owns the warning banner UX structure and interaction model.

8. `.github/agents/design-ui-designer.agent.md`
**Purpose:** Owns visual composition, spacing, and presentation refinement.

9. `.github/agents/design-inclusive-visuals-specialist.agent.md`
**Purpose:** Owns accessibility, contrast, and inclusive presentation checks.

10. `.github/agents/design-brand-guardian.agent.md`
**Purpose:** Owns consistency of tone, identity, and visual discipline.

11. `.github/agents/reality-checker.agent.md`
**Purpose:** Owns final evidence audit, residual-risk review, and phase exit certification.
