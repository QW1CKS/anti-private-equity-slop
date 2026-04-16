## Plan: YouTube Private Equity Warning Extension

TL;DR: Build a greenfield Chrome Manifest V3 extension in TypeScript. A content script on YouTube watch pages detects SPA navigation, extracts a stable channel identifier, and asks a background service worker for a locally cached blacklist match. The service worker syncs a remotely maintained, signed blacklist snapshot/delta feed on a schedule so the browser never sends per-view browsing data to the blacklist server. When a match is found, the content script injects a dismissible, non-modal shadow-DOM banner that warns the viewer without blocking playback or navigating away.

**Steps**
1. Define the runtime architecture and permission set first.
   - Use Manifest V3 with a service worker background, a YouTube content script, and an optional internal details page for More info.
   - Prefer a minimal permission set: `storage`, `alarms`, YouTube host permissions, and API host permissions. Add `scripting` only if a page-world fallback is required for channel extraction.
   - Keep the warning UI entirely in-page; do not use notifications or blocking redirects.
2. Design the blacklist service before writing the client.
   - Expose a versioned manifest plus snapshot/delta endpoints, with ETag and `If-None-Match` support.
   - Sign snapshots or manifests with an embedded public key so the client can verify integrity.
   - Key blacklist entries by canonical `channelId`, with alias indexes for handles, custom URLs, historic names, and any redirected identifiers.
   - Keep the public read API anonymous. Curator authentication belongs only on the admin side; the browser client should never send the current page channel ID to the server.
3. Implement a robust YouTube page detector and identifier resolver.
   - Target `youtube.com/watch`, `youtube.com/shorts`, `youtube.com/live`, and any other video page variants you explicitly support.
   - Re-run detection on YouTube SPA events such as `yt-navigate-finish`, `yt-page-data-updated`, and `popstate`, plus a debounced mutation observer for late-rendered metadata.
   - Resolve the active video ID from the URL, then resolve the channel by preferring stable identifiers in this order: `channelId`, then handle/custom URL aliases, then display name only as a non-matching hint.
   - Normalize handles and path aliases by Unicode NFKC, lowercasing handles, trimming whitespace, stripping leading `@`, decoding URL segments, and canonicalizing `/channel/`, `/@`, and `/c/` forms.
   - Fail closed on ambiguity: if the page only yields a name without a stable alias mapping, do not warn.
4. Build the local matcher and cache layer.
   - The background service worker owns the cached blacklist snapshot, the version metadata, and any incremental delta application.
   - Content scripts send the extracted identifiers to the background only for local matching against the cached dataset.
   - Cache results by `videoId + channelId + blacklistVersion` so the same page does not re-render banners repeatedly.
   - Use stale-while-revalidate semantics: show from the most recent cached snapshot, refresh in the background, and keep the last good dataset available offline.
   - Add a bounded TTL to prevent permanently stale data from living forever if refreshes repeatedly fail.
5. Design the warning UI and dismissal behavior.
   - Inject a fixed-position banner in a shadow root so page CSS cannot break it.
   - Keep it non-modal, accessible, and visually distinct but not aggressive; avoid overlays that cover playback controls or block interaction.
   - Include the warning message, matched firm name(s), a source link, a Dismiss button, and a More info action.
   - Make Dismiss close the banner immediately and store a local suppression record keyed to the specific video and channel, with a short TTL so the warning can appear again on another video or after the TTL expires.
   - Make More info open a new tab or extension detail page that shows the curated evidence and source links, without navigating away from the video.
6. Harden privacy, security, and performance.
   - Keep all per-page matching local so user browsing behavior is not leaked to the blacklist service.
   - Use strict extension CSP, no remote code, no inline scripts, no eval, and isolate the banner styles with shadow DOM.
   - Validate every API payload with a schema library before storing or using it.
   - Debounce DOM observation, short-circuit on non-video pages, and avoid repeated full-tree scans once a stable match is found.
   - Broadcast blacklist version changes from the service worker to content scripts so open tabs can re-evaluate without reload, but only from locally cached data.
7. Add internationalization and accessibility from the start.
   - Put all extension UI strings behind `chrome.i18n` message catalogs.
   - Keep blacklist data locale-neutral where possible, but allow localized source titles, notes, and firm display labels when available.
   - Ensure the banner works with keyboard navigation, screen readers, and RTL layouts.
   - Use a clear fallback chain for messages and source labels: user locale, English, then raw source text if needed.
8. Test the logic and the browser integration before release.
   - Unit test normalization, alias resolution, snapshot/delta application, dismissal persistence, and API schema validation.
   - Integration test the content script in Chromium with mocked YouTube DOM states and SPA navigation events.
   - Manually verify watch pages, shorts, live pages, renamed channels, custom URLs, redirects, duplicate channel names, offline mode, stale cache behavior, and false-positive resistance.
   - Add regression tests for the common YouTube failure modes: delayed metadata, dynamic re-rendering, and DOM structure changes.
9. Prepare deployment and maintenance workflows.
   - Host the blacklist API on a free-tier-friendly platform with CDN caching, a small admin surface, and an audit log for curator changes.
   - Keep data updates separate from extension code updates: the Chrome Web Store ships code, the API ships blacklist revisions.
   - Establish curator rules that require a source URL and a confidence label for each entry before publication.
   - Monitor dataset freshness, API errors, and signature verification failures without collecting browsing telemetry.

**Relevant files**
- `manifest.json` — MV3 permissions, host permissions, content script registration, CSP, and version metadata.
- `src/background/blacklist-sync.ts` — remote manifest/snapshot sync, ETag handling, delta application, storage persistence, and broadcast of version changes.
- `src/background/message-router.ts` — request/response glue between content scripts and cached blacklist data.
- `src/content/youtube-detector.ts` — YouTube SPA event handling, URL parsing, and channel identifier extraction.
- `src/content/channel-normalize.ts` — canonicalization helpers for channel IDs, handles, custom URLs, and name normalization.
- `src/content/warning-banner.ts` — shadow-DOM banner creation, accessibility wiring, and dismiss/more-info actions.
- `src/shared/blacklist-schema.ts` — schema validation for API payloads and local cache records.
- `src/shared/matcher.ts` — local match logic, alias resolution, cache-key generation, and suppression checks.
- `src/shared/i18n.ts` — message lookup helpers and locale fallback behavior.
- `src/options/details-page.ts` or `src/pages/details.ts` — optional internal details view for source links and dataset metadata.
- `tests/unit/*` — normalization, matching, cache, and schema tests.
- `tests/integration/*` — Chromium/Playwright extension harness with mocked YouTube states.
- `public/locales/*` — `chrome.i18n` message catalogs.

**Verification**
1. Run unit tests for normalization, matching, cache invalidation, and API schema parsing.
2. Run browser integration tests that simulate YouTube SPA navigation and confirm the banner appears exactly once per match, does not block playback, and respects dismissal.
3. Manually exercise edge cases: channel rename, handle change, custom URL redirect, duplicate names, ambiguous name-only pages, offline cache, and blacklist refresh while a tab stays open.
4. Verify the extension package loads in Chrome under MV3, the CSP blocks remote code, and the banner remains readable and dismissible in both desktop and narrower viewport layouts.

**Decisions**
- Use Manifest V3.
- Key blacklist entries on canonical `channelId`; treat name-only matching as insufficient for a warning.
- Keep all matching local to avoid leaking browsing data.
- Let the extension fail open when the page cannot be resolved confidently.
- Make dismissals local and time-bounded rather than permanent.
- Prefer a thin TypeScript codebase with a small utility stack such as `zod`, `vitest`, and `playwright`; avoid a large UI framework unless the later implementation phase proves it is needed.

**Further Considerations**
1. Decide whether “More info” should open an extension-hosted details page or a curated external source page. Recommendation: use an extension page for the first click, then link out to sources from there.
2. Decide whether to add the `scripting` permission for a page-world extraction fallback. Recommendation: start without it if DOM/meta extraction is sufficient in testing, then add it only if YouTube’s SPA behavior leaves gaps.
3. Decide whether blacklist refreshes should use a full snapshot only or snapshot plus deltas. Recommendation: ship with snapshot plus ETag first, then add deltas once curator volume makes the bandwidth savings worthwhile.