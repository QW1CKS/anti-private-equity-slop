UNIVERSAL EXECUTION PROMPT (ALL CUSTOM AGENTS, FOLLOW ALL STEPS IN ORDER, DO NOT SKIP ANY STEP, DO NOT JUMP TO ANOTHER PHASE, DO NOT PERFORM ANOTHER AGENT'S RESPONSIBILITIES WITHOUT EXPLICIT PULL-FORWARD APPROVAL)

1) Mandatory startup (always do this first)
- Read `AGENTS/ACTIVE_PHASE.md`.
- Read `AGENTS/PROGRESS_DASHBOARD.md`.
- Read `AGENTS/<current-phase>/README.md`.
- Read `AGENTS/<current-phase>/CHECKLIST.md`.
- Read workspace root `package.json`, `tsconfig.json`, and `AGENTS/<current-phase>/blockers.md`.

2) Scope lock
- Determine current phase and current owning agent from `AGENTS/ACTIVE_PHASE.md`.
- Execute only tasks assigned to your agent in the active phase checklist.
- Do not jump to another phase.
- Do not perform another agent's responsibilities unless explicit pull-forward approval is given.

3) Task selection and order
- Pick the next unchecked item assigned to your agent.
- Execute tasks in listed order unless a documented blocker requires reprioritization.
- Prefer implementation and verification over planning text.

4) Execution loop (repeat until your section is done)
- Implement the task.
- Verify results (run/build/test/lint/smoke checks as appropriate).
- Update the checklist immediately after each meaningful completion.
- Add concise evidence (file paths, commands run, test/build result, commit/PR link if available).
- Continue directly to the next unchecked item assigned to your agent.
- For non-blocking failures, attempt fix and re-run verification before moving on.
- If retry is needed due to transient errors, retry up to 2 times automatically.

5) Continuous-run and improvement behavior
- Keep agent actively running through tasks until one of these occurs:
  - all assigned tasks complete with verification,
  - a true blocker appears requiring user intervention,
  - workflow cannot proceed due to an unrecoverable system dependency.
- Apply fixable code issues immediately and rerun checks.
- For each completed task, add a mini-summary to the checklist.

6) Blocker identification and escalation
- A blocker requiring user intervention must be:
  - unresolved external dependency/credential/infrastructure unavailability,
  - policy/security constraint requiring explicit decision,
  - ambiguous requirements that prevent safe design execution,
  - explicitly requested by user stop.
- On blocker detection:
  - report concise blocker statement,
  - list what was tried and why unresolved,
  - ask for explicit user direction.

7) Post-completion output rules (concise)
- After task set completion, output a short, focused summary:
  - what changed,
  - verification results,
  - remaining open items (if any).
- Keep chatter minimal: no long-form narrative if not requested.

8) Progress tracking rules
- Keep checklist updates evidence-based. Mark complete only when implemented and verified.
- Record assumptions, partial completions, and decisions in checklist notes.
- Update `AGENTS/PROGRESS_DASHBOARD.md` when milestone status materially changes.

9) Handoff rules
- Update `AGENTS/ACTIVE_PHASE.md` only when ownership actually changes.
- On handoff, set next owning agent, last completed item, blockers, and date.
- Add a short handoff note in the active phase checklist.

10) Stop conditions (only these)
Stop only if:
1. Assigned section fully complete (including verified exits), or
2. A real blocker requiring user intervention occurs, or
3. Major missing dependency prevents safe progress.

11) If blocked, report only
- Exact blocker.
- What you already tried.
- Smallest next action needed from user or next agent.

12) Quality and UX non-negotiables
- Include concrete UI/UX progress in every phase where relevant.
- Maintain bilingual readiness (Arabic RTL and English LTR) in navigation/labels/critical alerts.
- Do not claim completion without verifiable evidence.

If not blocked, continue working until your current assigned section is genuinely complete.