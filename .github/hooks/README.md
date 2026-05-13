# Hooks

This folder contains curated hooks copied from the Agentic Brain vendor subset.

**Installed Hooks:**
- `tool-guardian/` - guardrails for tool usage
- `secrets-scanner/` - secret scanning checks
- `session-logger/` - session start/end logging
- `dependency-license-checker/` - dependency and license checks

## Session-End Sequencing
When running session-end hooks, preserve this order:
1. `secrets-scanner` (scan modified files)
2. `dependency-license-checker` (license compliance scan)
3. `session-logger` (record session end)

See `.github/hooks/hooks.json` for the consolidated hook configuration and ordering.

---
*Curated via Agentic Brain template installation*
