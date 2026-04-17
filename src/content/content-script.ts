/**
 * Content Script - Runs on YouTube pages
 * Detects channel info and communicates with service worker
 */

import {
  getChannelIdFromPage,
  getChannelNameFromPage,
  getChannelInfoFromUrl,
  isYouTubePage,
  isWatchPage,
  isChannelPage,
} from './youtube-detector.js';
import { showWarningBanner } from './warning-banner.js';

declare global {
  interface Window {
    __APE_showWarningBanner?: (channelName: string, reason?: string) => Promise<void>;
  }
}

// Expose a dev helper so you can invoke the banner from the content-script console
try { window.__APE_showWarningBanner = showWarningBanner; } catch (e) {}
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
    const _push = (history as any).pushState;
    const _replace = (history as any).replaceState;
    (history as any).pushState = function (...args: any[]) {
      const res = _push.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return res;
    };
    (history as any).replaceState = function (...args: any[]) {
      const res = _replace.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return res;
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
  const pageChannelId = getChannelIdFromPage();
  const pageChannelName = getChannelNameFromPage();

  // Combine all sources
  const result = {
    channelId: urlInfo?.channelId || pageChannelId || undefined,
    channelName: pageChannelName || undefined,
    handle: urlInfo?.handle,
    customUrl: urlInfo?.customUrl,
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
  try {
    const message: ChannelCheckMessage = {
      type: 'CHECK_CHANNEL',
      payload: channelInfo,
    };

    console.debug('APE debug: sending CHECK_CHANNEL', message);
    const response = await chrome.runtime.sendMessage(message) as ChannelCheckResponse;
    console.debug('APE debug: CHECK_CHANNEL response', response);

    if (response?.isBlacklisted) {
      await showWarningBanner(response.channelName || 'Unknown Channel', response.reason);
    }
  } catch (error) {
    console.error('Failed to check channel:', error);
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