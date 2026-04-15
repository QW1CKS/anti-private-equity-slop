# Agentic Workflow Initialization Guide

Welcome to the Agentic Workflow template! This folder contains all the boilerplates and instructions needed to enforce a structured, agent-driven, and phase-gated workflow for any new project using VS Code GitHub Copilot and custom agents.

## What is the Agentic Workflow?

Instead of prompting an AI randomly, this setup ensures that tasks are executed strictly in isolated **Phases**. Inside each phase, a pipeline of specific **Agents** (different instructions/roles) executes sequentially. A central **Orchestrator** agent creates tasks, reviews them, and signs off before advancing the phase.

## Directory Structure Overview

- `AGENTS_templates/`: Boilerplate files used to track progress (`ACTIVE_PHASE.md`, `PROGRESS_DASHBOARD.md`) and boilerplate phase folders (`PHASE_TEMPLATE/`).
- `.github_templates/`: Contains strict global AI instructions (`copilot-instructions.md`) and custom agent definitions (e.g., `agents-orchestrator.agent.md`).
- `PRD_TEMPLATE.md`: A structured Product Requirements Document template to define initial requirements before diving into development.

## Setup Instructions for a New Project

1. **Copy Global Instructions**: 
   Copy the contents of `AGENTIC_WORKFLOW/.github_templates/` to your actual `.github/` repository folder.
   - The `.github/copilot-instructions.md` acts as the law for your AI.
   - The `.github/agents/*.agent.md` defines custom personas.

2. **Initialize Agent Folders**:
   Rename or copy `AGENTIC_WORKFLOW/AGENTS_templates/` to the root folder `AGENTS/`.
   - Update `AGENTS/ACTIVE_PHASE.md` with your initial state.
   - Update `AGENTS/PROGRESS_DASHBOARD.md` with your high-level project milestones.

3. **Define Your First Phase**:
   Copy `AGENTS/PHASE_TEMPLATE/` into a new folder like `AGENTS/PHASE_1_FOUNDATION/`.
   - Edit `README.md` to define the goal and exit criteria.
   - Edit `CHECKLIST.md` to break the task down into exact roles/agents.

4. **Product Requirements**:
   Write your PRD using the `PRD_TEMPLATE.md` to feed concrete data into your newly established AI team.

## Mandatory Rules (The "Agentic Law")

Always enforce these rules in your agents (already embedded in the templates):
- **Agent Sequencing**: An agent cannot execute code if it's not their turn in `ACTIVE_PHASE.md`.
- **State Validation**: Every custom agent must load the `ACTIVE_PHASE.md`, phase `README.md`, and `CHECKLIST.md` as its very first action.
- **Evidence-Based Completeness**: Tasks in `CHECKLIST.md` are only marked as done when physical code is written and verified, never just "planned".