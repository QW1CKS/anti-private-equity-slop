# Learnings

## Pre-flight and write-after-action
- **ID:** LEA-20260416-001
- Read the memory index before changing anything.
- Keep decisions, learnings, and actions cross-linked with relative links.
- Append action rows to `03_actions.tsv` after meaningful work so the ledger stays current.
- Mirror the memory files in `AGENTIC_WORKFLOW/.github_templates/` and the live `.github/agent_memory/` folder.
- Related: [Memory Graph Contract](./01_decisions.md#memory-graph-contract)

## Curated asset reflection drift check
- **ID:** LEA-20260508-002
- During section-level validation, compare `AGENTS/REQUIRED_CUSTOM_AGENTS.md` against both runtime `.github/agents/` and phase checklist baseline.
- A missing doc reference (`playwright-tester`) can exist even when files are correctly installed.
- Validation should fail closed on documentation mismatch, then patch checklist baseline before marking section complete.
- Related: [Curated Asset Source-of-Truth Decision](./01_decisions.md#curated-asset-source-of-truth-decision-2026-05-08)

## Learning Entry Template
- **ID:** LEA-YYYYMMDD-XXX
- **Date:** TBD
- **Learning:** TBD
- **Source:** TBD
- **Validation:** TBD
- **Related:** TBD
