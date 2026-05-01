# Memory Health

## Memory Health Template
- **Checked At:** TBD
- **Checked By:** AGENTS/agents-orchestrator.agent.md
- **Broken Links:** TBD
- **Duplicate IDs:** TBD
- **Orphan Entries:** TBD
- **Notes:** ## 1. Project Overview
- **Name:** YouTube Private Equity Warning Extension
- **Description:** A Chrome Manifest V3 extension that detects YouTube videos from private equity-owned channels and displays a non-modal warning banner to viewers without blocking playback. Uses a locally-cached, remotely-updated blacklist to maintain user privacy.
- **Target Audience:** YouTube users who want to identify and avoid content from private equity-owned channels

## Validation Checklist
- [ ] No broken links between 00-06 memory files.
- [ ] No duplicate DEC/LEA/BLK IDs in markdown memory files.
- [ ] `03_actions.tsv` and `05_handoffs.tsv` remained append-only.
- [ ] `03_actions.tsv` and `05_handoffs.tsv` remain tab-separated with one row per line.
- [ ] If either TSV file exceeds 100 lines, a memory compression task recommendation was created.
- [ ] Active blockers in `04_blockers.md` referenced by checklist when relevant.
