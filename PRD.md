# Product Requirements Document (PRD)

## 1. Project Overview
- **Name:** YouTube Private Equity Warning Extension
- **Description:** A Chrome Manifest V3 extension that detects YouTube videos from private equity-owned channels and displays a non-modal warning banner to viewers without blocking playback. Uses a locally-cached, remotely-updated blacklist to maintain user privacy.
- **Target Audience:** YouTube users who want to identify and avoid content from private equity-owned channels

## 2. Goals & Success Metrics
- **Goals:** Build a privacy-preserving extension that warns users about private equity-owned YouTube channels without sending browsing data to any server
- **KPIs:** <200ms page detection, offline banner display, zero browsing data leakage

## 3. Product Scope
### 3.1 In Scope
- YouTube watch page detection (watch, shorts, live)
- Channel identifier extraction from YouTube SPA navigation
- Local blacklist matching in service worker
- Remote blacklist sync with ETag caching and signature verification
- Shadow-DOM warning banner injection
- Dismissal with time-bounded suppression
- i18n support for UI strings

### 3.2 Out of Scope (V2+)
- Block or redirect functionality
- Channel blocking/subscription management
- Background data collection or analytics

## 4. User Personas & Workflows
### Personas
- **P1:** Privacy-conscious YouTube viewer
- **P2:** YouTube creator wanting to check channel status

### Workflows
- **As a Privacy-conscious viewer**, I want to be warned about private equity channels so that I can make informed viewing decisions
  - *Flow:* Visit YouTube video -> Extension detects channel -> Check local blacklist -> Display warning banner (if match)

## 5. Technical Architecture
- **Frontend App:** Chrome Extension (Manifest V3)
- **Backend Services:** Blacklist API (read-only, anonymous)
- **Database Architecture:** Local chrome.storage.local for blacklist cache
- **Security:** Strict CSP, no remote code, shadow DOM isolation, signature verification

## 5.1 Repository Metadata (Machine-Readable)
- **Repo Profile:** frontend
- **Primary Language:** TypeScript
- **Frameworks:** Chrome Extension APIs, Web Extensions
- **Package Manager:** npm
- **Runtime:** Chrome (Extension)
- **CI Platform:** github-actions

### 5.1.1 Validation Commands
- **Build Command:** `npm run build` (if available, else manual)
- **Test Command:** `npm test` (unit tests)
- **Lint Command:** `npm run lint` (if available)

### 5.1.2 Source-of-Truth Paths
- **App Paths:** `src/`
- **Infra Paths:** N/A
- **Data Paths:** N/A
- **Docs Paths:** `docs/`

## 5.2 Foundation Contract Baseline (Phase 1)

### 5.2.1 Blacklist sync boundaries
- **Remote source boundary:** Service worker fetches snapshot only from `BLACKLIST_RAW_URL` (`src/shared/config.ts`) with ETag conditional requests (`src/background/blacklist-sync.ts`).
- **Local cache boundary:** Snapshot, ETag, and sync timestamp are persisted only in `chrome.storage.local` under `STORAGE_KEYS.BLACKLIST`, `STORAGE_KEYS.ETAG`, and `STORAGE_KEYS.LAST_SYNC`.
- **Matcher consumer boundary:** Matching logic (`src/shared/matcher.ts`) consumes `BlacklistSnapshot` only and does not perform network calls.
- **Snapshot contract fields:** Remote snapshots must include `version`, `updatedAt`, `signature`, and `entries`. Each entry must include a non-empty `channelName`, `addedAt`, and at least one stable identifier (`channelId`, `handles`, or `customUrl`).
- **ETag freshness contract:** A matching ETag permits reuse of the cached snapshot; a changed or missing ETag allows a background refresh, and a `304 Not Modified` response preserves the existing cached payload.
- **Cache lifecycle contract:** Stale cache remains readable for matching while revalidation runs. A successful remote refresh updates `STORAGE_KEYS.BLACKLIST`, `STORAGE_KEYS.ETAG`, and `STORAGE_KEYS.LAST_SYNC` together.

### 5.2.2 Extension message boundaries
- **Channel check request:** Content script sends `CHECK_CHANNEL` with `{ channelId?, channelName?, handle?, customUrl? }`.
- **Sync triggers:** Background sync is triggered by `BLACKLIST_SYNC`, scheduled alarms (`blacklist-sync`, `blacklist-sync-initial`), and browser startup.
- **Result flow:** Service worker returns check result payload (`isBlacklisted`, optional `channelName`/`reason`) and emits `BLACKLIST_UPDATED` to YouTube tabs after successful snapshot updates.
- **Message boundary contract:** `CHECK_CHANNEL` is the only content-to-background lookup request in Phase 2. Background sync messages are write-oriented only and must not expose raw snapshot payloads back to content script consumers.
- **Identifier precedence contract:** Matching prefers `channelId` first, then `handle`, then `customUrl`, then `channelName` for ambiguous inputs, with normalization applied before comparison.

### 5.2.3 Failure semantics
- **Network failure:** Keep existing cached snapshot if available and continue non-blocking local matching behavior.
- **Invalid snapshot:** Reject malformed remote payloads via runtime schema validation (`isValidSnapshot`) and fall back to bundled `blacklist.json` when possible.
- **Stale cache:** Treat stale cache as readable for matching while background sync attempts revalidation.
- **Service worker/message failure:** Content script retries `CHECK_CHANNEL`, then falls back to local storage / direct snapshot fetch path.
- **Error taxonomy:**
  - `network` for unreachable hosts, timeouts, or transport failures.
  - `parse` for malformed JSON or body decoding failures.
  - `validation` for schema violations, missing required snapshot fields, or malformed entries.
  - `unavailable` for empty fallback paths or missing local snapshot state after a failed refresh.

### 5.2.4 In-scope and out-of-scope architecture constraints
- **In-scope:** Local matching in extension runtime, read-only anonymous snapshot fetches, warning-only UX.
- **Out-of-scope:** Blocking/redirect behavior, browsing telemetry, analytics, or server-side channel check requests.

### 5.2.5 Type and runtime baseline
- **TypeScript strictness gate:** `tsconfig.json` must keep `"strict": true` for Phase 1+ quality gates. Phase closure cannot rely on lowering compiler strictness to pass.
- **Runtime module boundaries:** `src/background/` owns browser APIs, storage writes, and network sync; `src/content/` owns YouTube DOM detection/banner behavior and message requests; `src/shared/` owns pure types, schema guards, normalization, and matcher logic with no Chrome API or DOM side effects.
- **Schema/runtime validation contract:** Untrusted or untyped payloads (remote blacklist JSON, storage reads, and extension message payloads) must be validated with explicit runtime guards before consumption; blacklist snapshots must pass `isValidSnapshot` before cache writes or matcher usage.
- **Testability contract for next phases:** Domain logic should be extracted into pure helper functions with deterministic I/O and covered by isolated unit tests; side-effecting modules should stay thin orchestration layers around Chrome APIs and message transports.

### 5.2.6 Security baseline
- **Local matching and privacy posture:** Channel matching must remain local to the extension runtime and must not introduce browsing telemetry, analytics, or server-side channel checks.
- **Minimum-permission MV3 posture:** The manifest must stay on the smallest practical MV3 permission set for the feature set in scope. For Phase 1, `storage` and `alarms` are the only extension permissions, and additional permissions require an explicit phase review before they are introduced.
- **Secrets handling:** No hardcoded tokens, API keys, or private keys may be added to source, config, or generated artifacts. The `secrets-scanner` hook is required at session end, and high-confidence findings must block release or handoff until resolved.
- **Dependency, license, and security scans:** The `dependency-license-checker` hook and repository security review are release blockers when they surface high-risk issues such as critical vulnerabilities, copyleft-license violations, or other findings that would weaken the extension's privacy or supply-chain posture.
- **Security review evidence format:** Later-phase security reviews must record the review target, commands run, key findings with severity, affected files or paths, and the final disposition in the active phase checklist and action log.

## 6. Phase Breakdown (for Agentic Workflow)

- **Phase 1 - Foundation:** Manifest V3 setup, permissions, basic service worker, content script scaffold
- **Phase 2 - Blacklist API and Sync:** Blacklist API client, channel detection, normalization, local matcher, cache layer
- **Phase 3 - UI Development:** Warning banner, dismissal, i18n, accessibility
- **Phase 4 - Testing & Polish:** Unit tests, integration tests, edge cases, security hardening
- **Phase 5 - Deployment:** Chrome Web Store submission, API hosting, maintenance

## 6.1 Phase Adaptation Rules
- **Skip Phases:** None
- **Merge Phases:** None
- **Custom Sequence:** Linear

## 6.2 Exit Validation Contract
Each phase must define required artifacts and verification commands.

## 7. Awesome-Copilot Curation Inputs
- **Import Mode:** curated-only
- **Required Capabilities:** security, testing, chrome-extension
- **Tool Constraints:** None
- **Risk Posture:** strict

## 8. Persistent Memory Policy
- **Memory Location:** `.github/agent_memory/`
- **Log Strategy:** append-only
- **Retention:** quarterly snapshots

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
