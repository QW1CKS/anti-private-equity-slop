# Second Brain Index

This folder is the repo-local memory graph.

## Table of Contents
- [Decisions](./01_decisions.md#memory-graph-contract)
- [Learnings](./02_learnings.md#pre-flight-and-write-after-action)
- [Actions](./03_actions.tsv)
- [Blockers](./04_blockers.md#blocker-log-template)
- [Handoffs](./05_handoffs.tsv)
- [Memory Health](./06_memory_health.md#memory-health-template)

## How to Use
- Read this file first.
- Keep new entries short, concrete, and cross-linked.
- Prefer relative links between related entries.

## Hybrid Format Contract
- Markdown (`.md`) is for reasoning and synthesis:
	- `01_decisions.md`
	- `02_learnings.md`
	- `04_blockers.md`
- TSV (`.tsv`) is for append-only telemetry:
	- `03_actions.tsv`
	- `05_handoffs.tsv`
- YAML (`.yaml`) is for machine-readable catalog state:
	- `.github/agentic_brain/catalog/awesome-catalog.yaml`
	- `.github/agentic_brain/catalog/required-assets.yaml`

## Immutable Logging Policy
- `03_actions.tsv` and `05_handoffs.tsv` are append-only.
- Never delete historical entries.
- If a correction is needed, append a new row referencing the previous entry in `Linked_Decision_Node` or `Next_Action`.

## TSV Strict Rules
- Use literal tab separators only.
- Keep each record to one physical line.
- Do not use markdown table formatting.

## Memory Compression Rule
- If `03_actions.tsv` or `05_handoffs.tsv` exceeds 100 lines, propose a memory compression task before continuing.

## Entry ID Format
- Decisions: `DEC-YYYYMMDD-XXX`
- Learnings: `LEA-YYYYMMDD-XXX`
- Blockers: `BLK-YYYYMMDD-XXX`
