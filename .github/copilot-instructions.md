# Copilot Instructions

## Repository snapshot
This repository is currently a workflow scaffold for a future Chrome Manifest V3 extension. The main sources of truth are `plan.md` and the `AGENTIC_WORKFLOW/` templates until the real `AGENTS/` and `.github/` workflow files are materialized.

## Build, test, and lint
- No repo-specific build, test, or lint commands are defined yet.
- No package manifest or test runner is present in the current repository snapshot.
- When implementation code is added, prefer the repository’s own scripts over ad hoc commands.

## High-level architecture
- The project is being organized as a phase-gated delivery process, not a flat feature build.
- `AGENTIC_WORKFLOW/` is the template source; generated workflow state should live in `AGENTS/` and `.github/`.
- The target product in `plan.md` is a Chrome MV3 extension that:
  - resolves YouTube channel identity locally,
  - matches against a cached blacklist locally,
  - warns with a non-blocking shadow-DOM banner,
  - syncs blacklist data from a raw JSON file in the same GitHub repo.
- Keep matching local; the browser should not send per-view browsing data to the blacklist source.

## Key conventions
- Treat phase state as authoritative. If `AGENTS/ACTIVE_PHASE.md` exists, follow its agent order and scope before making changes.
- Checklist completion is evidence-based: only mark work done when the underlying files, commands, or runtime behavior are actually in place.
- When bootstrapping the workflow, keep `AGENTIC_WORKFLOW` as the template input and write the real repo state to `AGENTS/` and `.github/`.
- The blacklist contract assumes JSON from a same-repo raw URL, validated locally, cached as the last known good snapshot, and rejected if malformed.
- Fail closed on YouTube identity ambiguity; do not warn on display-name-only matches.

## Before changing code
- Read `plan.md` first.
- If `AGENTS/` has been created, read `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, and the active phase `README.md` / `CHECKLIST.md`.
- Prefer small, phase-aligned changes over broad repo-wide edits.
