# Phase 1 Checklist - Foundation

## Related Docs

- Overview: [../../README.md](../../README.md)
- Installation guide: [../../INSTALLATION.md](../../INSTALLATION.md)
- Product requirements template: [../../PRD.md](../../PRD.md)
- Universal execution protocol: [../../prompt.md](../../prompt.md)
- Copilot workflow contract template: [../../.github_templates/copilot-instructions.md](../../.github_templates/copilot-instructions.md)
- Active phase state template: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard template: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase README template: [./README.md](./README.md)

## Phase Goal
Set up the foundational architecture for the Chrome MV3 extension including manifest configuration, service worker skeleton, and basic project structure with tooling.

## Key Deliverables
- [ ] Manifest V3 configuration with minimal permissions (storage, alarms, YouTube host permissions)
- [ ] Service worker skeleton created and loads in Chrome
- [ ] TypeScript project compiles without errors
- [ ] Basic content script loads on YouTube watch/shorts/live pages
- [ ] Project folder structure follows planned architecture
- [ ] GitHub Actions CI workflow configured

---

## Agent - gem-orchestrator.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Initialize project with npm and install core dependencies (TypeScript, Vite, Vitest)
- [ ] Create manifest.json with MV3 configuration and minimal permissions
- [ ] Set up folder structure (src/background, src/content, src/shared, tests)
- [ ] Configure GitHub Actions workflow for build/test/lint pipeline

### Outputs
- [ ] Deliverable: manifest.json with MV3 configuration
- [ ] Deliverable: package.json with build/test/lint scripts
- [ ] Deliverable: tsconfig.json and vite.config.ts
- [ ] Deliverable: .github/workflows/ci.yml

### Exit Checks
- [ ] Build passes (npm run build)
- [ ] Tests pass (npm test)
- [ ] Lint passes (npm run lint)

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] If architectural decisions changed, append to `.github/agent_memory/01_decisions.md`
- [ ] If reusable implementation insight emerged, append to `.github/agent_memory/02_learnings.md`

### Evidence
- Artifacts: manifest.json, package.json, tsconfig.json, vite.config.ts, .github/workflows/ci.yml
- Validation: Build, test, lint all pass

---

## Agent - typescript-mcp-expert.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Create TypeScript configuration with strict type checking
- [ ] Set up Vite for Chrome Extension build with manifest handling
- [ ] Implement basic YouTube URL detection in content script
- [ ] Create service worker skeleton with message handling

### Outputs
- [ ] Deliverable: src/content/youtube-detector.ts with URL pattern matching
- [ ] Deliverable: src/background/service-worker.ts basic skeleton

### Exit Checks
- [ ] TypeScript compiles without errors
- [ ] Service worker loads in Chrome

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] If architectural decisions changed, append to `.github/agent_memory/01_decisions.md`
- [ ] If reusable implementation insight emerged, append to `.github/agent_memory/02_learnings.md`

### Evidence
- Artifacts: src/content/youtube-detector.ts, src/background/service-worker.ts
- Validation: TypeScript compilation passes

---

## Agent - github-actions-expert.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Create CI workflow for build/test/lint pipeline
- [ ] Configure matrix for Node.js versions
- [ ] Set up caching for npm dependencies
- [ ] Add workflow dispatch for manual runs

### Outputs
- [ ] Deliverable: .github/workflows/ci.yml

### Exit Checks
- [ ] Workflow syntax is valid
- [ ] Workflow can be triggered

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] If architectural decisions changed, append to `.github/agent_memory/01_decisions.md`

### Evidence
- Artifacts: .github/workflows/ci.yml
- Validation: YAML syntax valid

---

## Agent - critical-thinking.agent.md

### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Review project structure against PRD requirements
- [ ] Analyze permission set for minimum necessary access
- [ ] Evaluate build tooling for extension compatibility

### Outputs
- [ ] Architectural review notes in memory

### Exit Checks
- [ ] All decisions documented

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`
- [ ] Append architectural decisions to `.github/agent_memory/01_decisions.md`

### Evidence
- Artifacts: 01_decisions.md updates
- Validation: All decisions recorded
	- `.github/agent_memory/01_decisions.md`
	- `.github/agent_memory/02_learnings.md`
	- `.github/agent_memory/03_actions.tsv`
	- `.github/agent_memory/04_blockers.md`
	- `.github/agent_memory/05_handoffs.tsv`
	- `.github/agent_memory/06_memory_health.md`
	- `.github/agentic_brain/catalog/awesome-catalog.yaml`
	- `.github/agentic_brain/catalog/required-assets.yaml`
- Keep memory updates append-only. Never rewrite historical action/handoff rows.
- TSV rules are mandatory for `.tsv` files:
	- use literal tab separators,
	- keep each record to one physical line,
	- do not use markdown table pipes.