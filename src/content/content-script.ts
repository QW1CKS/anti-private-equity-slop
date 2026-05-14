/**
 * Content Script - Runs on YouTube pages
 * Detects channel info and communicates with service worker
 */

import {
  getChannelIdFromPage,
  getChannelNameFromPage,
  getChannelInfoFromPage,
  getChannelInfoFromUrl,
  getVideoIdFromUrl,
  isYouTubePage,
  isWatchPage,
  isChannelPage,
} from './youtube-detector.js';
import { showWarningBanner, removeInjectedBanner } from './warning-banner.js';
import { BLACKLIST_RAW_URL } from '../shared/config.js';
import { STORAGE_KEYS } from '../shared/types.js';
import type { ChannelCheckMessage } from '../shared/types.js';
import { isValidSnapshot } from '../shared/blacklist-schema.js';

declare global {
  interface Window {
    __APE_showWarningBanner?: (channelName: string, reason?: string, channelKey?: string) => Promise<void>;
  }
}

// Expose a dev helper so you can invoke the banner from the content-script console
try {
  const w = window as unknown as Record<string, unknown>;
  w['__APE_showWarningBanner'] = showWarningBanner as unknown;
} catch (e) {
  void e;
}
interface ChannelCheckResponse {
  isBlacklisted: boolean;
  channelName?: string;
  reason?: string;
}

// Listen for URL changes (YouTube SPA navigation)
function setupNavigationObserver(): void {
  let lastUrl = location.href;
  let lastHandledUrl = lastUrl;
  let navigationTimeout: number | null = null;

  // Listen for blacklist updates from service worker
  chrome.runtime.onMessage.addListener((message: any) => {
    if (message && message.type === 'BLACKLIST_UPDATED') {
      console.log('APE: Blacklist updated to version', message.payload?.version, '- clearing local cache');
      // Clear any cached snapshot in content script by invalidating the storage read cache
      // The next check will re-read from storage which should have the new version
      lastBlacklistCheckVersion = null;
      // Re-check current page with new blacklist
      setTimeout(() => onPageChange(), 100);
    }
    return true;
  });

  // Create a robust "locationchange" signal by wrapping History API methods
  (function ensureLocationChangeEvent() {
    type PushStateFn = (data?: unknown, unused?: string, url?: string | URL | null) => void;
    const _push = history.pushState as unknown as PushStateFn;
    const _replace = history.replaceState as unknown as PushStateFn;
    (history as unknown as { pushState: PushStateFn }).pushState = function (data?: unknown, unused?: string, url?: string | URL | null) {
      _push.call(this, data, unused, url);
      window.dispatchEvent(new Event('locationchange'));
    };
    (history as unknown as { replaceState: PushStateFn }).replaceState = function (data?: unknown, unused?: string, url?: string | URL | null) {
      _replace.call(this, data, unused, url);
      window.dispatchEvent(new Event('locationchange'));
    };
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
  })();

  // Debounced handler for navigation changes
  const handleLocationChange = () => {
    if (location.href === lastHandledUrl) return;
    lastHandledUrl = location.href;

    // Clear any injected banner UI from previous navigation (DOM-only clear)
    try { removeInjectedBanner(); } catch (e) { /* ignore */ }

    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
    }
    // allow YouTube to update DOM/ytInitialData, then run
    navigationTimeout = window.setTimeout(() => {
      onPageChange();
      navigationTimeout = null;
    }, 300);
  };

  // Listen for our custom locationchange event
  window.addEventListener('locationchange', handleLocationChange);

  // Also listen for YouTube-specific navigation events as an extra fallback
  window.addEventListener('yt-navigate-finish', handleLocationChange, true);
  window.addEventListener('yt-page-data-updated', handleLocationChange, true);

  // Fallback MutationObserver in case other signals are missed
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      handleLocationChange();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check after a short delay to let page settle
  setTimeout(onPageChange, 1500);
}

// Handle page change - extract channel info and check
async function onPageChange(): Promise<void> {
  if (!isYouTubePage()) {
    return;
  }

  // Skip non-watch and non-channel pages
  if (!isWatchPage() && !isChannelPage()) {
    return;
  }

  // Small delay for DOM to update
  // Clear any previously injected banner UI before attempting new extraction
  try { removeInjectedBanner(); } catch (e) { /* ignore */ }
  await delay(500);

  // Try extraction with retries because YouTube is SPA and data may load slowly
  await tryExtractAndCheck(15); // up to ~10s
}

// Try to extract channel info multiple times with small delays
async function tryExtractAndCheck(triesLeft = 6): Promise<void> {
  const channelInfo = extractChannelInfo();
  console.debug('APE debug: extracted channelInfo', channelInfo, 'triesLeft', triesLeft);
  // Only proceed if we have a valid handle, channelId, or customUrl and non-empty channelName
  if (channelInfo && (channelInfo.handle || channelInfo.channelId || channelInfo.customUrl) && channelInfo.channelName) {
    await checkChannel(channelInfo);
    return;
  }
  if (triesLeft > 0) {
    await delay(700);
    return tryExtractAndCheck(triesLeft - 1);
  }
  console.debug('APE debug: no channel info after retries');
}

// Extract channel info from YouTube page (combining URL and DOM)
function extractChannelInfo(): {
  channelId?: string;
  channelName?: string;
  handle?: string;
  customUrl?: string;
} | null {
  // NEW: Prevent DOM race conditions on watch pages
  if (isWatchPage()) {
    try {
      const currentUrlVideoId = getVideoIdFromUrl();
      const flexy = document.querySelector('ytd-watch-flexy') as HTMLElement | null;
      let domPlayerVideoId: string | null = null;
      if (flexy) {
        domPlayerVideoId = flexy.getAttribute('video-id') || flexy.getAttribute('data-video-id') || null;
      }
      if (currentUrlVideoId && domPlayerVideoId && currentUrlVideoId !== domPlayerVideoId) {
        console.debug('APE debug: DOM is stale, waiting for YouTube to update...', { currentUrlVideoId, domPlayerVideoId });
        return null; // force retry
      }
    } catch (e) {
      // ignore errors - continue with best-effort extraction
    }
  }

  // First try URL-based extraction
  const urlInfo = getChannelInfoFromUrl();
  // Then get additional info from page DOM
  const pageInfo = getChannelInfoFromPage();

  // Combine all sources, but only trust channelName if paired with a valid id/handle/customUrl
  const channelId = urlInfo?.channelId || pageInfo?.channelId;
  const handle = urlInfo?.handle || (pageInfo as any)?.handle;
  const customUrl = urlInfo?.customUrl || (pageInfo as any)?.customUrl;
  const channelName = (pageInfo && (pageInfo as any).channelName) || void 0;

  // Only return if we have a valid id/handle/customUrl
  if (!channelId && !handle && !customUrl) {
    return null;
  }
  return {
    channelId,
    channelName,
    handle,
    customUrl
  };
}

// Check channel against blacklist via service worker
async function checkChannel(channelInfo: {
  channelId?: string;
  channelName?: string;
  handle?: string;
  customUrl?: string;
}): Promise<void> {
  // If the extension context was recently invalidated (extension reloaded),
  // avoid hammering the chrome APIs and back off briefly.
  if ((window as any).__APE_extensionContextInvalidatedUntil && Date.now() < (window as any).__APE_extensionContextInvalidatedUntil) {
    console.warn('Skipping CHECK_CHANNEL because extension context recently invalidated');
    return;
  }

  // First, try a local cached blacklist (fast path, avoids sending messages to the SW)
  try {
    const cached = await getCachedSnapshotFromStorage();
    if (cached && isValidSnapshot(cached)) {
      console.debug('APE debug: using cached blacklist from storage (fast path)');
      const cachedRes = checkSnapshotForMatch(cached, channelInfo);
      if (cachedRes?.isBlacklisted) {
        await showWarningBanner(
          cachedRes.channelName || channelInfo.channelName || 'Unknown Channel',
          cachedRes.reason,
          channelInfo.handle || channelInfo.channelId || (cachedRes.channelName || channelInfo.channelName || 'Unknown Channel')
        );
        return;
      }
      else {
        try {
          console.debug('APE debug: cached snapshot did not match', channelInfo, 'snapshotVersion', cached.version, 'entries', Array.isArray(cached.entries) ? cached.entries.length : 0);
        } catch (e) {
          // ignore logging errors
        }
      }
    }
  } catch (err) {
    console.warn('Failed to read cached blacklist from storage (fast path):', err);
  }

  // Try to send to service worker with a couple retries.
  const message: ChannelCheckMessage = {
    type: 'CHECK_CHANNEL',
    payload: channelInfo,
  };

  console.debug('APE debug: sending CHECK_CHANNEL', message);

  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    attempts++;
    try {
      const response = await chrome.runtime.sendMessage(message) as ChannelCheckResponse;
      console.debug('APE debug: CHECK_CHANNEL response', response);
      if (response?.isBlacklisted) {
        await showWarningBanner(
          response.channelName || channelInfo.channelName || 'Unknown Channel',
          response.reason,
          channelInfo.handle || channelInfo.channelId || (response.channelName || channelInfo.channelName || 'Unknown Channel')
        );
      } else {
        try { removeInjectedBanner(); } catch (e) { /* ignore */ }
      }
      return;
    } catch (error) {
      console.warn('CHECK_CHANNEL attempt', attempts, 'failed:', error);
      // If the extension context was invalidated (common during dev reloads),
      // back off and avoid repeated attempts for a short period.
      try {
        const msg = (error && (error as any).message) || String(error);
        if (typeof msg === 'string' && msg.includes('Extension context invalidated')) {
          // Back off for 30s
          (window as any).__APE_extensionContextInvalidatedUntil = Date.now() + 30_000;
          console.warn('Extension context invalidated detected; backing off for 30s');
          break;
        }
      } catch {}
      // If this was the last attempt, break and try fallback
      if (attempts >= maxAttempts)
        break;
      // small backoff
      await delay(250 * attempts);
    }
  }

  // Fallback: try to fetch the raw blacklist directly from GitHub (best-effort)
  try {
    // First try a local cached blacklist (avoid messaging the service worker)
    try {
      const cached = await getCachedSnapshotFromStorage();
      if (cached) {
        console.debug('APE debug: using cached blacklist from storage');
        const res = checkSnapshotForMatch(cached, channelInfo);
        if (res?.isBlacklisted) {
          await showWarningBanner(
            res.channelName || channelInfo.channelName || 'Unknown Channel',
            res.reason,
            channelInfo.handle || channelInfo.channelId || (res.channelName || channelInfo.channelName || 'Unknown Channel')
          );
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to read cached blacklist from storage:', err);
    }

    if (BLACKLIST_RAW_URL && !BLACKLIST_RAW_URL.includes('USERNAME')) {
      console.debug('APE debug: falling back to direct fetch from', BLACKLIST_RAW_URL);
      const fb = await tryFallbackCheck(channelInfo);
      if (fb?.isBlacklisted) {
        await showWarningBanner(
          fb.channelName || channelInfo.channelName || 'Unknown Channel',
          fb.reason,
          channelInfo.handle || channelInfo.channelId || (fb.channelName || channelInfo.channelName || 'Unknown Channel')
        );
        return;
      } else {
        try { removeInjectedBanner(); } catch (e) { /* ignore */ }
        return;
      }
    }
  } catch (err) {
    console.warn('Fallback direct fetch failed:', err);
  }

  // No match and all checks exhausted — ensure injected UI is cleared
  try { removeInjectedBanner(); } catch (e) { /* ignore */ }
  console.error('Failed to check channel: service worker unavailable and fallback failed');
}

async function tryFallbackCheck(channelInfo: {
  channelId?: string;
  channelName?: string;
  handle?: string;
  customUrl?: string;
}): Promise<ChannelCheckResponse> {
  try {
    // Try packaged blacklist first (extension resource) to avoid network dependency
    let snapshot: unknown = null;
    try {
      const localUrl = chrome.runtime.getURL('blacklist.json');
      const localRes = await fetch(localUrl, { cache: 'no-store' });
      if (localRes.ok) snapshot = await localRes.json();
    } catch (e) {
      // ignore local fetch failures
    }

    if (!isValidSnapshot(snapshot)) {
      snapshot = null;
    }

    // If no packaged snapshot, try remote raw URL
    if (!snapshot) {
      if (!BLACKLIST_RAW_URL || BLACKLIST_RAW_URL.includes('USERNAME')) {
        console.warn('No valid BLACKLIST_RAW_URL configured');
        return { isBlacklisted: false };
      }
      const res = await fetch(BLACKLIST_RAW_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      snapshot = await res.json();
    }

    if (!isValidSnapshot(snapshot)) {
      console.warn('tryFallbackCheck rejected invalid remote snapshot');
      return { isBlacklisted: false };
    }

    const entries = Array.isArray(snapshot?.entries) ? snapshot.entries : [];

    const normalize = (s: any) => {
      if (typeof s !== 'string') return '';
      let t = s.replace(/\s+/g, ' ').trim();
      const idx = t.search(/\bsubscribers\b/i);
      if (idx !== -1) t = t.slice(0, idx).trim();
      return t.toLowerCase();
    };

    for (const entry of entries) {
      if (!entry) continue;
      // match by channelId
      if (channelInfo.channelId && entry.channelId === channelInfo.channelId) {
        return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
      }
      // match by handle (case-insensitive)
      if (channelInfo.handle && Array.isArray(entry.handles)) {
        const handles = entry.handles.map((h: string) => String(h).toLowerCase());
        if (handles.includes(String(channelInfo.handle).toLowerCase())) {
          return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
        }
      }
      // match by customUrl
      if (channelInfo.customUrl && entry.customUrl === channelInfo.customUrl) {
        return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
      }
      // match by channelName (case-insensitive exact after cleaning)
      if (channelInfo.channelName && normalize(entry.channelName) === normalize(channelInfo.channelName)) {
        return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
      }
      // match historic names
      if (channelInfo.channelName && Array.isArray(entry.historicNames)) {
        for (const hn of entry.historicNames) {
          if (normalize(hn) === normalize(channelInfo.channelName)) {
            return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
          }
        }
      }
    }

    return { isBlacklisted: false };
  } catch (err) {
    console.warn('tryFallbackCheck failed:', err);
    return { isBlacklisted: false };
  }
}

// Utility function
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait for the owner anchor to be present and stable within the meta/owner area
function waitForOwnerAnchor(timeoutMs = 2000): Promise<boolean> {
  const start = Date.now();
  return new Promise(resolve => {
    let lastHref: string | null = null;
    let lastText: string | null = null;
    let stableSince = 0;

    const sel = '#meta-contents ytd-video-owner-renderer a[href^="/@"], #meta-contents ytd-video-owner-renderer a[href*="/channel/"], ytd-video-owner-renderer a[href^="/@"], ytd-video-owner-renderer a[href*="/channel/"]';

    const check = () => {
      try {
        const el = document.querySelector<HTMLAnchorElement>(sel);
        if (el) {
          const href = el.getAttribute('href') || '';
          const text = (el.textContent || '').trim();

          // If href and text are stable for at least 250ms, consider it ready
          if (href === lastHref && text === lastText) {
            if (!stableSince) stableSince = Date.now();
            else if (Date.now() - stableSince >= 250) return resolve(true);
          } else {
            lastHref = href;
            lastText = text;
            stableSince = 0;
          }

          // As a fallback, accept visible elements even if not yet stable
          try {
            const rects = el.getClientRects();
            const visible = rects && rects.length > 0 && Array.from(rects).some(r => r.width > 0 && r.height > 0);
            if (visible && (href || text) && Date.now() - start > 400) {
              // wait at least a short time so we don't pick up mid-replacement
              return resolve(true);
            }
          } catch {
            // ignore getClientRects errors
          }
        }
      } catch {
        // ignore
      }

      if (Date.now() - start > timeoutMs) return resolve(false);
      setTimeout(check, 100);
    };

    check();
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupNavigationObserver);
} else {
  setupNavigationObserver();
}

// Read the cached blacklist snapshot directly from chrome.storage.local
let lastBlacklistCheckVersion: string | null = null;
let cachedSnapshotFromStorage: unknown | null = null;

async function getCachedSnapshotFromStorage(): Promise<unknown | null> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.BLACKLIST);
    const snapshot = result[STORAGE_KEYS.BLACKLIST] ?? null;
    
    // Cache the snapshot and its version to avoid repeated storage reads
    if (isValidSnapshot(snapshot) && snapshot.version !== lastBlacklistCheckVersion) {
      cachedSnapshotFromStorage = snapshot;
      lastBlacklistCheckVersion = snapshot.version;
    }
    
    return isValidSnapshot(cachedSnapshotFromStorage) ? cachedSnapshotFromStorage : null;
  } catch (err) {
    console.warn('getCachedSnapshotFromStorage failed:', err);
    try {
      const msg = (err && (err as any).message) || String(err);
      if (typeof msg === 'string' && msg.includes('Extension context invalidated')) {
        (window as any).__APE_extensionContextInvalidatedUntil = Date.now() + 30_000;
        console.warn('Extension context invalidated detected while reading storage; backing off for 30s');
      }
    } catch {}
    return null;
  }
}

// Check an in-memory snapshot for a match (same logic as tryFallbackCheck)
function checkSnapshotForMatch(snapshot: unknown, channelInfo: { channelId?: string; channelName?: string; handle?: string; customUrl?: string; }): ChannelCheckResponse | null {
  try {
    if (!isValidSnapshot(snapshot)) return null;
    const entries = Array.isArray(snapshot?.entries) ? snapshot.entries : [];
    console.debug('APE debug: checkSnapshotForMatch checking', entries.length, 'entries against', channelInfo);
    const normalize = (s: any) => {
      if (typeof s !== 'string') return '';
      let t = s.replace(/\s+/g, ' ').trim();
      const idx = t.search(/\bsubscribers\b/i);
      if (idx !== -1) t = t.slice(0, idx).trim();
      return t.toLowerCase();
    };

    for (const entry of entries) {
      if (!entry) continue;
      console.debug('APE debug: checking entry:', entry.channelName, 'handles:', entry.handles, 'vs channelInfo handle:', channelInfo.handle);
      if (channelInfo.channelId && entry.channelId === channelInfo.channelId) {
        console.debug('APE debug: MATCH by channelId', channelInfo.channelId);
        return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
      }
      if (channelInfo.handle && Array.isArray(entry.handles)) {
        const handles = entry.handles.map((h: string) => String(h).toLowerCase());
        const handleLower = String(channelInfo.handle).toLowerCase();
        console.debug('APE debug: handle check - handles array:', handles, 'looking for:', handleLower, 'includes result:', handles.includes(handleLower));
        if (handles.includes(handleLower)) {
          console.debug('APE debug: MATCH by handle', handleLower);
          return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
        }
      }
      if (channelInfo.customUrl && entry.customUrl === channelInfo.customUrl) {
        console.debug('APE debug: MATCH by customUrl', channelInfo.customUrl);
        return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
      }
      if (channelInfo.channelName && normalize(entry.channelName) === normalize(channelInfo.channelName)) {
        console.debug('APE debug: MATCH by channelName', channelInfo.channelName);
        return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
      }
      if (channelInfo.channelName && Array.isArray(entry.historicNames)) {
        for (const hn of entry.historicNames) {
          if (normalize(hn) === normalize(channelInfo.channelName)) {
            console.debug('APE debug: MATCH by historicNames', hn);
            return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
          }
        }
      }
    }

    console.debug('APE debug: no match found');
    return { isBlacklisted: false };
  } catch (err) {
    console.warn('checkSnapshotForMatch failed:', err);
    return null;
  }
}