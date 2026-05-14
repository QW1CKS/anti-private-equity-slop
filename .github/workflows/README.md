# Workflows

This folder contains curated GitHub Actions workflows for repository validation.

**Installed Workflows:**
- `build.yml` - build, test, and lint checks on push and pull requests
- `dependency-review.yml` - dependency diff review on pull requests
- `codeql.yml` - CodeQL analysis on push, pull requests, and weekly schedule

**Merge Policy:**
- Red checks block merges; there is no bypass for failing build, test, or lint gates.

---
*Curated via Agentic Brain template installation*
