# Required Custom Agents for <Project Name>

This is the mandatory custom-agent set for delivering the project end to end.

No optional agents should be included here.

## How To Use This File

Short answer: execute work phase by phase, and inside each phase run the listed agents in a strictly defined sequential order.

Use this operational loop for every phase:

1. Orchestrator opens the phase and sets scope, deliverables, and acceptance criteria.
2. Domain-specific agents (e.g., architecture, design, backend) implement work in small defined batches.
3. Testing and Security agents evaluate data states and code functionality locally.
4. Orchestrator closes the phase only when all exit criteria pass.

**CRITICAL RULE:** Do not start the next phase until the current phase exit criteria are entirely met.

## Required Agents Only

1. `.github/agents/agents-orchestrator.agent.md`
**Purpose:** Coordinates all other agents, assigns ownership by phase, ensures tasks are completed via evidence, and prevents workflow gaps.

2. `<path/to/architect-agent.agent.md>`
**Purpose:** Owns system-level technical decisions and project boundaries.

3. `<path/to/development-agent.agent.md>`
**Purpose:** Builds features according to architectural blueprints.
