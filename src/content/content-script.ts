/**
 * Content Script - Runs on YouTube pages
 * Detects channel info and communicates with service worker
 */

import {
  getChannelIdFromPage,
  getChannelNameFromPage,
  getChannelInfoFromPage,
  getChannelInfoFromUrl,
  isYouTubePage,
  isWatchPage,
  isChannelPage,
} from './youtube-detector.js';
import { showWarningBanner } from './warning-banner.js';
import { BLACKLIST_RAW_URL } from '../shared/config.js';
import { STORAGE_KEYS } from '../shared/types.js';

declare global {
  interface Window {
    __APE_showWarningBanner?: (channelName: string, reason?: string) => Promise<void>;
  }
}

// Expose a dev helper so you can invoke the banner from the content-script console
try {
  const w = window as unknown as Record<string, unknown>;
  w['__APE_showWarningBanner'] = showWarningBanner as unknown;
} catch (e) {
  void e;
}
// Types for message passing
interface ChannelCheckMessage {
  type: 'CHECK_CHANNEL';
  payload: {
    channelId?: string;
    channelName?: string;
    handle?: string;
    customUrl?: string;
  };
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
  await delay(500);

  // Try extraction with retries because YouTube is SPA and data may load slowly
  await tryExtractAndCheck(3);
}

// Try to extract channel info multiple times with small delays
async function tryExtractAndCheck(triesLeft = 3): Promise<void> {
  const channelInfo = extractChannelInfo();
  console.debug('APE debug: extracted channelInfo', channelInfo, 'triesLeft', triesLeft);
  if (channelInfo) {
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
  // First try URL-based extraction
  const urlInfo = getChannelInfoFromUrl();
  
  // Then get additional info from page DOM
    const pageInfo = getChannelInfoFromPage();

  // Combine all sources
    const result = {
        channelId: urlInfo?.channelId || pageInfo?.channelId || void 0,
        channelName: pageInfo?.channelName || void 0,
        handle: urlInfo?.handle || (pageInfo as any)?.handle,
        customUrl: urlInfo?.customUrl || (pageInfo as any)?.customUrl
  };

  // Need at least one identifier to check
  if (!result.channelId && !result.channelName && !result.handle && !result.customUrl) {
    return null;
  }

  return result;
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
    if (cached) {
      console.debug('APE debug: using cached blacklist from storage (fast path)');
      const cachedRes = checkSnapshotForMatch(cached, channelInfo);
      if (cachedRes?.isBlacklisted) {
        await showWarningBanner(cachedRes.channelName || channelInfo.channelName || 'Unknown Channel', cachedRes.reason);
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
        await showWarningBanner(response.channelName || channelInfo.channelName || 'Unknown Channel', response.reason);
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
          await showWarningBanner(res.channelName || channelInfo.channelName || 'Unknown Channel', res.reason);
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
        await showWarningBanner(fb.channelName || channelInfo.channelName || 'Unknown Channel', fb.reason);
        return;
      }
    }
  } catch (err) {
    console.warn('Fallback direct fetch failed:', err);
  }

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
    let snapshot: any = null;
    try {
      const localUrl = chrome.runtime.getURL('blacklist.json');
      const localRes = await fetch(localUrl, { cache: 'no-store' });
      if (localRes.ok) snapshot = await localRes.json();
    } catch (e) {
      // ignore local fetch failures
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupNavigationObserver);
} else {
  setupNavigationObserver();
}

// Read the cached blacklist snapshot directly from chrome.storage.local
async function getCachedSnapshotFromStorage(): Promise<any | null> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.BLACKLIST);
    return result[STORAGE_KEYS.BLACKLIST] ?? null;
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
function checkSnapshotForMatch(snapshot: any, channelInfo: { channelId?: string; channelName?: string; handle?: string; customUrl?: string; }): ChannelCheckResponse | null {
  try {
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
      if (channelInfo.channelId && entry.channelId === channelInfo.channelId) {
        return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
      }
      if (channelInfo.handle && Array.isArray(entry.handles)) {
        const handles = entry.handles.map((h: string) => String(h).toLowerCase());
        if (handles.includes(String(channelInfo.handle).toLowerCase())) {
          return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
        }
      }
      if (channelInfo.customUrl && entry.customUrl === channelInfo.customUrl) {
        return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
      }
      if (channelInfo.channelName && normalize(entry.channelName) === normalize(channelInfo.channelName)) {
        return { isBlacklisted: true, channelName: entry.channelName, reason: entry.reason };
      }
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
    console.warn('checkSnapshotForMatch failed:', err);
    return null;
  }
}