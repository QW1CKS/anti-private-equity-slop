# Learnings Log

## Overview
This file captures reusable implementation insights, patterns, and lessons learned.

## Learning Template
When adding a learning, use this format:

```
## <Learning Title>

- **Date:** YYYY-MM-DD
- **Context:** <What was being worked on>
- **Insight:** <What was learned>
- **Impact:** <How this affects future work>
- **Tags:** <relevant, tags, here>
```

---

## Phase 3 Asset Curation Insights

- **Date:** 2026-04-16
- **Context:** Curating agents, hooks, skills, and instructions from awesome-copilot for Chrome MV3 extension project
- **Insight:** awesome-copilot workflows folder contains only markdown documentation files, not actual GitHub Actions workflows. This means no CI/CD workflows are available in the vendor folder.
- **Impact:** Need to create CI/CD workflow manually or use GitHub Actions expert agent to build it. Phase READMEs should reflect that workflows are not imported from vendor.
- **Tags:** asset-curation, awesome-copilot, workflow
