# Product Requirements Document (PRD)

## 1. Project Overview

- **Name:** YouTube Private Equity Warning Extension
- **Description:** A privacy-first Chrome Manifest V3 extension that detects when users are watching videos from channels owned or backed by private equity firms, and displays a non-modal warning banner. The extension maintains a locally cached, cryptographically signed blacklist to ensure user browsing data never leaves the browser while still providing up-to-date warnings.
- **Target Audience:** YouTube viewers who want awareness of private equity influence on content they consume; privacy-conscious users who want transparency without sacrificing browsing privacy.

## 2. Goals & Success Metrics

- **Goals:**
  - Provide accurate, real-time warnings when viewing PE-owned YouTube channels
  - Maintain zero per-view browsing data leakage to external servers
  - Achieve seamless, non-blocking user experience that doesn't interrupt video playback
  - Enable offline functionality with stale-while-revalidate cache semantics

- **KPIs:**
  - Extension loads successfully in Chrome under MV3
  - Banner appears within 2 seconds of page stabilization for matched channels
  - Zero false positives on channels not in blacklist
  - Cache refresh succeeds with ETag-based delta updates
  - 100% dismissal persistence accuracy (dismissed banners stay dismissed for TTL duration)

## 3. Product Scope

### 3.1 In Scope
- Manifest V3 extension with service worker background
- Content script for YouTube watch, shorts, and live page detection
- Local blacklist caching with signed snapshot/delta support
- Shadow-DOM injected warning banner (non-modal, dismissible)
- Channel identifier normalization (channelId, handles, custom URLs, historic names)
- Message catalog-based i18n with English locale fallback
- Unit and integration test coverage
- Privacy-preserving architecture (no per-view data sent to blacklist server)

### 3.2 Out of Scope (V2+)
- Browser action popup UI
- Platform beyond Chrome (Firefox, Edge, Safari)
- Real-time notification system
- User accounts and personalization
- Curator admin interface (blacklist management)

## 4. User Personas & Workflows

### Personas
- **P1:** Privacy-Conscious Viewer — Wants transparency about content creators but prioritizes not sharing browsing data with third parties
- **P2:** Extension Developer — May extend the extension or adapt it for different use cases

### Workflows
- **As a Privacy-Conscious Viewer**, I want to be warned when watching PE-owned channels so that I can make informed decisions about the content I'm consuming without my viewing habits being tracked.
  - *Flow:* Navigate to YouTube video → Extension detects YouTube SPA navigation → Extract channel identifier → Query local cached blacklist → Inject warning banner if match found → User can Dismiss or click More Info

- **As an Extension Developer**, I want clear separation between content scripts, background service worker, and shared utilities so that I can maintain and extend the codebase.
  - *Flow:* Understand architecture → Extend channel normalization → Add new detection patterns → Run tests → Verify in browser

## 5. Technical Architecture
- **Frontend App:** Chrome Extension (Manifest V3) — TypeScript
- **Backend Services:** Anonymous blacklist API (read-only, no auth required for consumers)
- **Storage:** Chrome extension storage API (`chrome.storage.local`) for blacklist cache
- **Security:**
  - Strict CSP (no remote code, no inline scripts, no eval)
  - Shadow DOM for banner isolation
  - Cryptographic signature verification for blacklist payloads
  - ETag/If-None-Match for efficient delta updates
  - All matching performed locally — no channel IDs sent to external API

## 5.1 Repository Metadata (Machine-Readable)
- **Repo Profile:** frontend
- **Primary Language:** TypeScript
- **Framework:** Chrome Extension MV3
- **Package Manager:** npm
- **Test Framework:** Vitest + Playwright

## 6. Phase Structure

### Phase 1 — Foundation
- Manifest V3 setup with minimal permissions
- Service worker skeleton
- Basic YouTube page detection (URL matching)
- Project structure and tooling setup

### Phase 2 — Core Implementation
- Blacklist sync service (manifest, snapshot, deltas)
- Channel identifier extraction and normalization
- Local matcher and cache layer
- Message router between content and background

### Phase 3 — UI/Feature Development
- Shadow-DOM warning banner
- Dismissal and suppression logic
- More info page integration
- i18n message catalogs

### Phase 4 — Testing & Polish
- Unit tests for normalization and matching
- Integration tests with Playwright
- Manual testing on edge cases
- CSP and security hardening

### Phase 5 — Deployment
- Chrome Web Store submission
- API deployment (free-tier platform)
- Documentation
- Release monitoring

## 7. Key Technical Decisions

1. **Manifest V3 with Service Worker** — Required by Chrome for background processing
2. **Local-only Matching** — Privacy requirement: browser never sends channel IDs to blacklist server
3. **Fail-Closed Ambiguity** — Name-only matching insufficient; require stable identifier (channelId or alias)
4. **Non-modal Banner** — UX requirement: don't block playback or navigation
5. **Shadow DOM Isolation** — Security requirement: prevent page CSS from breaking banner
6. **TypeScript with Zod** — Type safety + schema validation
7. **Vitest + Playwright** — Unit tests and browser integration tests

## 8. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| YouTube DOM changes break detection | Mutation observer + multiple detection strategies |
| Stale blacklist causes false negatives | TTL + stale-while-revalidate + background refresh |
| Privacy leakage through timing attacks | No analytics, no telemetry, local-only matching |
| Banner blocked by page CSS | Shadow DOM isolation |# Product Requirements Document (PRD)

## Related Docs

- Overview: [README.md](README.md)
- Installation guide: [INSTALLATION.md](INSTALLATION.md)
- Universal execution protocol: [prompt.md](prompt.md)
- Copilot workflow contract template: [.github_templates/copilot-instructions.md](.github_templates/copilot-instructions.md)
- Active phase state template: [AGENTS_templates/ACTIVE_PHASE.md](AGENTS_templates/ACTIVE_PHASE.md)
- Progress dashboard template: [AGENTS_templates/PROGRESS_DASHBOARD.md](AGENTS_templates/PROGRESS_DASHBOARD.md)
- Phase README template: [AGENTS_templates/PHASE_TEMPLATE/README.md](AGENTS_templates/PHASE_TEMPLATE/README.md)
- Phase checklist template: [AGENTS_templates/PHASE_TEMPLATE/CHECKLIST.md](AGENTS_templates/PHASE_TEMPLATE/CHECKLIST.md)

## 1. Project Overview
- **Name:** `<Project Name>`
- **Description:** `<One paragraph elevator pitch of what this product solves and what it is>`
- **Target Audience:** `<Who are the intended users?>`

## 2. Goals & Success Metrics
- **Goals:** `<What business/technical realities define success?>`
- **KPIs:** `<Measurable metrics e.g. Handle 10,000 req/sec, <200ms TTFB>`

## 3. Product Scope
### 3.1 In Scope
- `<Feature 1, e.g., Authenticated user session sharing>`
- `<Feature 2, e.g., Admin dashboard with basic CRUD operations>`
- `<Feature 3, e.g., Notification system>`

### 3.2 Out of Scope (V2+)
- `<Feature to defer, e.g., Payment integrations>`
- `<Feature to defer, e.g., Advanced AI analytics>`

## 4. User Personas & Workflows
### Personas
- **P1:** `<Admin User>`
- **P2:** `<End User>`

### Workflows
- **As an `<End User>`**, I want `<to sign up quickly>` so that `<I can immediately access the service>`.
  - *Flow:* Splash Screen -> Registration Form -> OAuth -> Main Dashboard.

## 5. Technical Architecture
- **Frontend App:** `<e.g., React Native/Expo, NextJS>`
- **Backend Services:** `<e.g., Firebase Serverless, Express REST API>`
- **Database Architecture:** `<e.g., NoSQL Firestore, PostgreSQL>`
- **Security:** `<Authentication mechanism, rule enforcements>`

## 5.1 Repository Metadata (Machine-Readable)
- **Repo Profile:** `<auto | frontend | backend | fullstack | data | infra>`
- **Primary Language:** `<typescript | python | go | java | rust | other>`
- **Frameworks:** `<comma-separated list>`
- **Package Manager:** `<npm | pnpm | yarn | pip | poetry | uv | maven | gradle | go>`
- **Runtime:** `<node | python | jvm | go | mixed>`
- **CI Platform:** `<github-actions | azure-devops | gitlab | none>`

### 5.1.1 Validation Commands
- **Build Command:** `<e.g., pnpm build>`
- **Test Command:** `<e.g., pnpm test>`
- **Lint Command:** `<e.g., pnpm lint>`
- **Smoke Command:** `<optional quick verification command>`

### 5.1.2 Source-of-Truth Paths
- **App Paths:** `<src/, apps/, services/>`
- **Infra Paths:** `<infra/, terraform/, bicep/>`
- **Data Paths:** `<notebooks/, data/, pipelines/>`
- **Docs Paths:** `<docs/, ADR paths>`

## 6. Phase Breakdown (for Agentic Workflow)
*Map these logically so the Agents Orchestrator knows what to plan.*

- **Phase 1: Foundation:** `<Monorepo setup, auth loops, basic routing>`
- **Phase 2: Core Domain Models:** `<Data schemas and API boilerplate>`
- **Phase 3: Core MVP Features:** `<The central logic loops>`
- **Phase 4: Design & Refinement:** `<Polishing UI/UX across breakpoints>`
- **Phase 5: Launch:** `<Environment deployments, final security audits>`

## 6.1 Phase Adaptation Rules
- **Skip Phases:** `<phase IDs to skip for this repo>`
- **Merge Phases:** `<pairs to merge when practical>`
- **Custom Sequence:** `<explicit phase order if not linear>`

## 6.2 Exit Validation Contract
- Each phase must define:
  - required artifacts,
  - verification commands,
  - evidence row keys into `.github/agent_memory/03_actions.tsv`.

## 7. Awesome-Copilot Curation Inputs
- **Import Mode:** `<install-everything | curated-only | hybrid>`
- **Required Capabilities:** `<security, testing, performance, docs, infra, data, uiux ...>`
- **Tool Constraints:** `<allowed/disallowed MCPs or integrations>`
- **Risk Posture:** `<strict | balanced | exploratory>`

## 8. Persistent Memory Policy
- **Memory Location:** `.github/agent_memory/`
- **Log Strategy:** `append-only`
- **Retention:** `<archive policy, e.g. quarterly snapshots>`
- **Linking Rule:** `every checklist completion must reference at least one memory entry`

Return to overview: [README.md](README.md)
