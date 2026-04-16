# Product Requirements Document (PRD)

## 1. Project Overview
- **Name:** YouTube Private Equity Warning Extension
- **Description:** A Chrome Manifest V3 extension that detects when users watch YouTube videos from private equity-owned channels. The extension uses a locally cached blacklist to match channels without sending browsing data to any server, then displays a dismissible, non-modal warning banner that informs viewers about the PE ownership without blocking playback.
- **Target Audience:** Privacy-conscious YouTube users who want transparency about channel ownership, particularly viewers concerned about private equity consolidation of media.

## 2. Goals & Success Metrics
- **Goals:**
  - Provide accurate, real-time warnings when viewing PE-owned YouTube channels
  - Maintain complete user privacy by keeping all matching local (no per-view browsing data sent to external servers)
  - Support offline functionality with cached blacklist data
  - Ensure zero interference with YouTube playback experience
  
- **KPIs:**
  - Warning accuracy: >99% true positive rate with zero false positives on non-PE channels
  - Performance: <50ms blacklist matching latency
  - Privacy: Zero network requests containing video IDs or channel IDs to blacklist server
  - Offline: Full functionality when blacklist API is unreachable

## 3. Product Scope

### 3.1 In Scope
- Chrome Manifest V3 extension with service worker background
- YouTube SPA detection for watch, shorts, and live pages
- Local blacklist matching with cached data (no per-view server calls)
- Shadow-DOM warning banner injection (non-blocking, dismissible)
- Blacklist sync via signed snapshot/delta API with ETag support
- Channel identifier normalization (channelId, handles, custom URLs, legacy redirects)
- Keyboard-accessible, RTL-compatible warning banner
- Internationalization support via chrome.i18n
- Extension details page for "More info" link

### 3.2 Out of Scope (V2+)
- Firefox/Safari extension support
- YouTube Studio integration
- Community-driven channel reporting
- Browser action popup UI (inline banner only)

## 4. User Personas & Workflows

### Personas
- **P1:** Privacy-conscious YouTube viewer who wants to know about PE ownership
- **P2:** Content creator wanting transparency about PE consolidation

### Workflows
- **As a YouTube viewer**, I want to see a non-intrusive warning when watching a PE-owned channel so that I can make informed viewing decisions without interruption.
  - *Flow:* Visit YouTube video page → Extension detects page load → Extract channel ID → Query local blacklist cache → If match, inject warning banner → User can dismiss or click "More info"

## 5. Technical Architecture
- **Extension Type:** Chrome Manifest V3 (MV3)
- **Primary Language:** TypeScript
- **Build Tools:** Vite or similar lightweight bundler
- **Testing:** Vitest (unit), Playwright (integration)
- **Schema Validation:** Zod

### 5.1 Repository Metadata (Machine-Readable)
- **Repo Profile:** extension | frontend
- **Primary Language:** typescript
- **Frameworks:** manifest-v3, vitest, playwright
- **Package Manager:** npm
- **Runtime:** chrome-extension

### 5.1.1 Validation Commands
- **Build Command:** `npm run build`
- **Test Command:** `npm test`
- **Lint Command:** `npm run lint`

### 5.1.2 Source-of-Truth Paths
- **Extension Paths:** `src/background/`, `src/content/`, `src/shared/`, `src/options/`
- **Tests Paths:** `tests/unit/`, `tests/integration/`
- **Public Paths:** `public/locales/`

## 6. Phase Breakdown (for Agentic Workflow)

- **Phase 1 - Foundation:** Extension scaffold with MV3 manifest, minimal permissions, YouTube detection infrastructure, blacklist sync base
- **Phase 2 - Core Implementation:** Channel identifier extraction, normalization, local matching, warning banner UI
- **Phase 3 - Testing:** Unit and integration testing, edge cases, accessibility audit
- **Phase 4 - Deployment:** Chrome Web Store prep, API hosting, curator workflow

## 6.1 Phase Adaptation Rules
- **Skip Phases:** None
- **Merge Phases:** None
- **Custom Sequence:** Linear progression as defined above

## 6.2 Exit Validation Contract
Each phase must define:
- Required artifacts
- Verification commands
- Evidence row keys into `.github/agent_memory/03_actions.tsv`

## 7. Security Requirements (Phase 1 Floor - Non-Negotiable)

- Minimal permission set: `storage`, `alarms`, YouTube host permissions, blacklist API host only
- NO tabs, webRequest, notifications, or scripting permissions in Phase 1
- All matching happens locally in service worker - never send videoId/channelId to blacklist server
- Strict CSP: no remote code, no inline scripts, no eval
- Shadow DOM isolation for warning banner
- Fail-closed on ambiguous channel identification (name-only without stable ID = no warning)

## 8. Awesome-Copilot Curation Inputs
- **Import Mode:** curated-only
- **Required Capabilities:** testing, security, chrome-extension-specific patterns
- **Tool Constraints:** None specific
- **Risk Posture:** strict (privacy-first project)

## 9. Persistent Memory Policy
- **Memory Location:** `.github/agent_memory/`
- **Log Strategy:** append-only
- **Retention:** Quarterly snapshots
- **Linking Rule:** Every checklist completion must reference at least one memory entry
