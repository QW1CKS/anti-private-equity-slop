/**
 * YouTube Detector - Extract channel and video info from YouTube pages
 */

export interface YouTubeVideoInfo {
  videoId: string;
  channelId?: string;
  channelName?: string;
}

export interface YouTubeChannelPageInfo {
  channelId: string;
  channelName?: string;
  handle?: string;
  customUrl?: string;
}

// URL patterns for YouTube
const YOUTUBE_PATTERNS = {
  WATCH: /^\/watch$/,
  CHANNEL: /^\/channel\/([^/?#]+)/,
  HANDLE: /^\/@([^/?#]+)/,
  CUSTOM_URL: /^\/c\/([^/?#]+)/,
  SHORT: /^\/shorts\/([^/?#]+)/,
  LIVE: /^\/live\/([^/?#]+)/,
};

// Extract video ID from various YouTube URL patterns
function extractVideoId(pathname: string, searchParams: URLSearchParams): string | null {
  if (YOUTUBE_PATTERNS.WATCH.test(pathname)) {
    return searchParams.get('v');
  }
  
  const shortsMatch = pathname.match(YOUTUBE_PATTERNS.SHORT);
  if (shortsMatch) {
    return shortsMatch[1];
  }
  
  const liveMatch = pathname.match(YOUTUBE_PATTERNS.LIVE);
  if (liveMatch) {
    return liveMatch[1];
  }
  
  return null;
}

// Extract channel ID from URL
function extractChannelIdFromUrl(pathname: string): string | null {
  const channelMatch = pathname.match(YOUTUBE_PATTERNS.CHANNEL);
  if (channelMatch) {
    return channelMatch[1];
  }
  return null;
}

// Extract handle from URL (@username)
function extractHandleFromUrl(pathname: string): string | null {
  const handleMatch = pathname.match(YOUTUBE_PATTERNS.HANDLE);
  if (handleMatch) {
    return handleMatch[1];
  }
  return null;
}

// Extract custom URL from URL (/c/username)
function extractCustomUrlFromUrl(pathname: string): string | null {
  const customMatch = pathname.match(YOUTUBE_PATTERNS.CUSTOM_URL);
  if (customMatch) {
    return customMatch[1];
  }
  return null;
}

// Get video ID from current page via URL
export function getVideoIdFromUrl(): string | null {
  const url = new URL(window.location.href);
  return extractVideoId(url.pathname, url.searchParams);
}

// Get channel info from current page URL
export function getChannelInfoFromUrl(): { channelId?: string; handle?: string; customUrl?: string } | null {
  const url = new URL(window.location.href);
  const pathname = url.pathname;

  const channelId = extractChannelIdFromUrl(pathname);
  if (channelId) {
    return { channelId };
  }

  const handle = extractHandleFromUrl(pathname);
  if (handle) {
    return { handle };
  }

  const customUrl = extractCustomUrlFromUrl(pathname);
  if (customUrl) {
    return { customUrl };
  }

  return null;
}

// Extract channel ID from page DOM (more reliable for watch pages)
export function getChannelIdFromPage(): string | null {
  // Try meta tags (most reliable)
  const metaChannel = document.querySelector('meta[itemprop="channelId"]');
  if (metaChannel instanceof HTMLMetaElement) {
    return metaChannel.content;
  }

  // Try JSON-LD structured data
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  const scriptArray = Array.from(jsonLdScripts);
  for (const script of scriptArray) {
    try {
      const data = JSON.parse(script.textContent || '') as Record<string, unknown>;
      const typeKey = '@type';
      if (data[typeKey] === 'VideoObject' && data.channelId) {
        return data.channelId as string;
      }
      if (data[typeKey] === 'BreadcrumbList') {
        const itemList = data.itemListElement as Array<Record<string, unknown>> | undefined;
        for (const item of itemList || []) {
          if (item.item === 'VideoObject' && item.channelId) {
            return item.channelId as string;
          }
        }
      }
    } catch {
      // Skip invalid JSON
    }
  }

  // Try to find from page data
  const ytInitialData = getYtInitialData();
  if (ytInitialData) {
    // Navigate the complex YouTube data structure
    const channelId = extractChannelIdFromYtInitialData(ytInitialData);
    if (channelId) {
      return channelId;
    }
  }

  // Fallback: scan anchors in the page for a channel link (e.g., /channel/UC...)
  try {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
    for (const a of anchors) {
      const href = a.getAttribute('href') || '';
      if (!href) continue;
      // skip javascript: or fragment links
      if (href.startsWith('javascript:') || href.startsWith('#')) continue;

      try {
        const u = new URL(href, location.origin);
        const cid = extractChannelIdFromUrl(u.pathname);
        if (cid && cid.startsWith('UC')) return cid;
      } catch {
        // ignore invalid URLs
      }
    }
  } catch {
    // ignore
  }

  return null;
}

// Get channel name from page
export function getChannelNameFromPage(): string | null {
  // Try meta tag
  const metaChannel = document.querySelector('meta[itemprop="name"]');
  if (metaChannel instanceof HTMLMetaElement) {
    return metaChannel.content;
  }

  // Try from ytInitialData
  const ytInitialData = getYtInitialData();
  if (ytInitialData) {
    const channelName = extractChannelNameFromYtInitialData(ytInitialData);
    if (channelName) {
      return channelName;
    }
  }

  return null;
}

// Extract ytInitialData from page
function getYtInitialData(): unknown {
  // 1) Check for element with id (older approach)
  const script = document.getElementById('ytInitialData');
  if (script) {
    try {
      return JSON.parse(script.textContent || '');
    } catch {
      // fallthrough to other heuristics
    }
  }

  // 2) Check common global variables YouTube injects
  const g = window as unknown as Record<string, unknown>;
  if (g['ytInitialData']) return g['ytInitialData'];
  if (g['ytInitialPlayerResponse']) return g['ytInitialPlayerResponse'];

  // 3) Search inline scripts for assignments like "ytInitialData = {...}" or "window.ytInitialData = {...}"
  const scripts = Array.from(document.scripts);
  for (const s of scripts) {
    const txt = s.textContent || '';
    // try to extract ytInitialData JSON
    const m = txt.match(/ytInitialData\s*=\s*(\{[\s\S]*?\})\s*;/m);
    if (m && m[1]) {
      try { return JSON.parse(m[1]); } catch (e) { void e; }
    }

    // try ytInitialPlayerResponse
    const p = txt.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\})\s*;/m);
    if (p && p[1]) {
      try { return JSON.parse(p[1]); } catch (e) { void e; }
    }
  }

  // 4) As a last resort, try reading window.__INITIAL_DATA__-like aliases
  if (g['__INITIAL_DATA__']) return g['__INITIAL_DATA__'];

  return null;
}

// Navigate YouTube's complex data structure to find channel info
function extractChannelIdFromYtInitialData(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;

  const dataObj = data as Record<string, unknown>;

  // Try various paths where YouTube stores channel ID
  const paths = [
    'playerOverlays.playerOverlayRenderer.decoratedPlayerViewRenderer.decoratedPlayerViewRenderer.playerOverlay.videoDetailsWatchOverlayepi.channelId',
    'playerOverlays.playerOverlayRenderer.videoDetailsWatchOverlay.channelId',
    'contents.twoColumnWatchNextResults.results.results.contents.0.videoPrimaryInfoRenderer.channelId',
    'contents.twoColumnWatchNextResults.secondaryResults.results.0.searchResultOverlay.channelId',
  ];

  for (const path of paths) {
    const value = getNestedValue(dataObj, path.split('.'));
    if (typeof value === 'string' && value.startsWith('UC')) {
      return value;
    }
  }

  return null;
}

// Navigate YouTube's complex data structure to find channel name
function extractChannelNameFromYtInitialData(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;

  const dataObj = data as Record<string, unknown>;

  const paths = [
    'playerOverlays.playerOverlayRenderer.videoDetailsWatchOverlay.title.simpleText',
    'contents.twoColumnWatchNextResults.results.results.contents.0.videoPrimaryInfoRenderer.title.simpleText',
    'contents.twoColumnWatchNextResults.results.results.contents.0.videoPrimaryInfoRenderer.channelTitle.simpleText',
  ];

  for (const path of paths) {
    const value = getNestedValue(dataObj, path.split('.'));
    if (typeof value === 'string') {
      return value;
    }
  }

  return null;
}

// Helper to get nested object value
function getNestedValue(obj: Record<string, unknown>, keys: string[]): unknown {
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }
  return current;
}

// Detect if current page is YouTube
export function isYouTubePage(): boolean {
  return window.location.hostname === 'www.youtube.com' ||
         window.location.hostname === 'youtube.com' ||
         window.location.hostname === 'm.youtube.com';
}

// Check if current page is a video watch page
export function isWatchPage(): boolean {
  const url = new URL(window.location.href);
  return YOUTUBE_PATTERNS.WATCH.test(url.pathname) ||
         YOUTUBE_PATTERNS.SHORT.test(url.pathname) ||
         YOUTUBE_PATTERNS.LIVE.test(url.pathname);
}

// Check if current page is a channel page
export function isChannelPage(): boolean {
  const url = new URL(window.location.href);
  return YOUTUBE_PATTERNS.CHANNEL.test(url.pathname) ||
         YOUTUBE_PATTERNS.HANDLE.test(url.pathname) ||
         YOUTUBE_PATTERNS.CUSTOM_URL.test(url.pathname);
}