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

// Heuristic to detect placeholder or encoded gibberish strings that are not real channel names
function isLikelyPlaceholder(raw?: string): boolean {
  if (!raw) return false;
  const s = raw.trim();
  if (!s) return false;
  // uppercase identifiers like GUIDED_HELP or ALL_CAPS_WITH_UNDERSCORES
  if (/^[A-Z0-9_\-]+$/.test(s) && s === s.toUpperCase() && s.includes('_')) return true;
  // percent-encoded or base64-like strings
  if (/^[A-Za-z0-9+/=%-]{12,}$/.test(s)) return true;
  // strings that contain lots of percent encodings or equals signs
  if (/[=%]{2,}/.test(s)) return true;
  return false;
}

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

  // Prefer explicit owner link rendered near the video (more reliable than scanning all anchors)
  try {
    const ownerSelectors = [
      'ytd-video-owner-renderer a[href*="/channel/"]',
      'ytd-channel-name a[href*="/channel/"]',
      'a.yt-simple-endpoint.yt-formatted-string[href*="/channel/"]',
      // Handle-based links (@username)
      'ytd-video-owner-renderer a[href^="/@"]',
      'ytd-channel-name a[href^="/@"]',
      'a.yt-simple-endpoint.yt-formatted-string[href^="/@"]'
    ];
    for (const sel of ownerSelectors) {
      const ownerLink = document.querySelector<HTMLAnchorElement>(sel);
      if (ownerLink) {
        try {
          const u = new URL(ownerLink.href, location.origin);
          // First try channel ID
          const cid = extractChannelIdFromUrl(u.pathname);
          if (cid && cid.startsWith('UC')) return cid;
          // Then try handle (@username)
          const handle = extractHandleFromUrl(u.pathname);
          if (handle) return handle;
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }

  // Fallback: scan anchors in the page for a channel link or handle
  try {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
    for (const a of anchors) {
      const href = a.getAttribute('href') || '';
      if (!href) continue;
      // skip javascript: or fragment links
      if (href.startsWith('javascript:') || href.startsWith('#')) continue;

      try {
        const u = new URL(href, location.origin);
        // First try channel ID
        const cid = extractChannelIdFromUrl(u.pathname);
        if (cid && cid.startsWith('UC')) return cid;
        // Then try handle (@username)
        const handle = extractHandleFromUrl(u.pathname);
        if (handle) return handle;
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

  // Prefer owner / channel name rendered in the DOM (more reliable during SPA navigation)
  try {
    const ownerEl = document.querySelector('#meta-contents ytd-channel-name, ytd-video-owner-renderer ytd-channel-name, ytd-channel-name, a.yt-simple-endpoint[href^="/@"]');
    if (ownerEl) {
      const txt = ownerEl.textContent?.trim();
      if (txt) {
        const t = txt.toLowerCase();
        const generic = ['your videos', 'videos', 'home', 'playlists', 'channels', 'community', 'shorts'];
        if (!generic.includes(t) && !isLikelyPlaceholder(txt)) return txt;
      }
    }
  } catch {
    // ignore
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

  // Try quick paths first (common locations)
  const dataObj = data as Record<string, unknown>;
  const paths = [
    'playerOverlays.playerOverlayRenderer.videoDetailsWatchOverlay.channelId',
    'contents.twoColumnWatchNextResults.results.results.contents.0.videoPrimaryInfoRenderer.channelId',
    'playerResponse.videoDetails.author',
  ];

  for (const path of paths) {
    const value = getNestedValue(dataObj, path.split('.'));
    if (typeof value === 'string' && value.startsWith('UC')) {
      return value;
    }
  }

  // As a fallback, search the object recursively for the first string that looks like a YouTube channel ID (starts with 'UC')
  function findChannelIdRecursive(obj: unknown, depth = 0): string | null {
    if (depth > 8 || obj == null) return null;
    if (typeof obj === 'string' && /^UC[a-zA-Z0-9_-]{20,25}$/.test(obj)) return obj;
    if (typeof obj === 'object') {
      for (const k of Object.keys(obj as Record<string, unknown>)) {
        try {
          const v = (obj as Record<string, unknown>)[k];
          const found = findChannelIdRecursive(v, depth + 1);
          if (found) return found;
        } catch {
          // ignore
        }
      }
    }
    return null;
  }

  const found = findChannelIdRecursive(dataObj, 0);
  return found;
}

// Navigate YouTube's complex data structure to find channel name
function extractChannelNameFromYtInitialData(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;

  const dataObj = data as Record<string, unknown>;

  const paths = [
    'contents.twoColumnWatchNextResults.results.results.contents.0.videoPrimaryInfoRenderer.channelTitle.simpleText',
    'contents.twoColumnWatchNextResults.results.results.contents.0.videoPrimaryInfoRenderer.owner.videoOwnerRenderer.title.runs.0.text',
    'playerResponse.videoDetails.author',
    'videoDetails.author',
  ];

  for (const path of paths) {
    const value = getNestedValue(dataObj, path.split('.'));
    if (typeof value === 'string') return value;
  }

  // Fallback: recursively search for likely channel-name keys
  function findChannelNameRecursive(obj: unknown, depth = 0): string | null {
    if (depth > 8 || obj == null) return null;
    if (typeof obj === 'string') {
      // heuristic: skip very long strings that are likely video descriptions
      if (obj.length > 200) return null;
      // avoid pure URLs
      if (/https?:\/\//.test(obj)) return null;
      // likely candidate
      return obj;
    }
    if (typeof obj === 'object') {
      for (const k of Object.keys(obj as Record<string, unknown>)) {
        if (/title|author|owner|channel|name/i.test(k)) {
          const v = (obj as Record<string, unknown>)[k];
          const found = findChannelNameRecursive(v, depth + 1);
          if (found) return found;
        }
      }
      // also traverse all children as fallback
      for (const k of Object.keys(obj as Record<string, unknown>)) {
        try {
          const v = (obj as Record<string, unknown>)[k];
          const found = findChannelNameRecursive(v, depth + 1);
          if (found) return found;
        } catch {
          // ignore
        }
      }
    }
    return null;
  }

  return findChannelNameRecursive(dataObj, 0);
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

// Get both channelId and channelName from page in a single pass to avoid mismatches
export function getChannelInfoFromPage(): { channelId?: string; channelName?: string } | null {
  // 1) Meta tags
  try {
    const metaChannel = document.querySelector('meta[itemprop="channelId"]') as HTMLMetaElement | null;
    const metaName = document.querySelector('meta[itemprop="name"]') as HTMLMetaElement | null;
    if (metaChannel && metaChannel.content) {
      const mn = metaName?.content;
      // Skip placeholder-looking meta names (e.g., GUIDED_HELP) to avoid false positives
      if (mn && !isLikelyPlaceholder(mn)) {
        return { channelId: metaChannel.content, channelName: mn };
      }
      // otherwise continue to other heuristics
    }
  } catch {
    // ignore
  }

  // 2) Owner-renderer link (most reliable on watch pages)
  // 2) Owner-renderer link (most reliable on watch pages)
  // Prefer anchors inside the `ytd-video-owner-renderer` or `#meta-contents`
  // container to avoid accidentally picking unrelated channel links elsewhere
  // in the DOM (which caused 'TLDR News Global' / incorrect picks).
  let ownerAnchorHref: string | undefined;
  let ownerAnchorText: string | undefined;
  try {
    // Helper to clean noisy channel name text (remove subscriber counts and collapse whitespace)
    function cleanChannelName(raw?: string): string | undefined {
      if (!raw) return undefined;
      // Split into lines, trim, and filter out empty and subscriber lines
      const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l && !/subscribers/i.test(l));
      // Use the first non-empty, non-subscriber line
      if (lines.length) return lines[0];
      return undefined;
    }

    const isGenericLabel = (s?: string) => {
      if (!s) return true;
      const raw = s.trim();
      const t = raw.toLowerCase();
      if (!t) return true;
      const stop = [
        'your videos', 'videos', 'home', 'playlists', 'channels', 'community', 'shorts',
        'about', 'featured channels', 'discussion'
      ];
      if (stop.includes(t)) return true;
      if (t.length < 2) return true;
      if (isLikelyPlaceholder(raw)) return true;
      if (!/[a-zA-Z\p{L}]/u.test(t)) return true;
      return false;
    };

    // Prefer the owner renderer inside the #meta-contents area (watch page primary info)
    const ownerRenderer = document.querySelector<HTMLElement>('#meta-contents ytd-video-owner-renderer')
      || document.querySelector<HTMLElement>('ytd-video-owner-renderer')
      || document.querySelector<HTMLElement>('#meta-contents ytd-channel-name')
      || document.querySelector<HTMLElement>('ytd-channel-name');

    if (ownerRenderer) {
      let ownerAnchor: HTMLAnchorElement | null = null;
      ownerAnchor = ownerRenderer.querySelector<HTMLAnchorElement>('a[href*="/channel/"]');
      if (!ownerAnchor) ownerAnchor = ownerRenderer.querySelector<HTMLAnchorElement>('a[href*="/@"]');
      if (!ownerAnchor) ownerAnchor = ownerRenderer.querySelector<HTMLAnchorElement>('ytd-channel-name a');
      if (!ownerAnchor) ownerAnchor = ownerRenderer.querySelector<HTMLAnchorElement>('a');

        if (ownerAnchor && ownerAnchor.href) {
          ownerAnchorHref = ownerAnchor.href;
          const text = (ownerAnchor.textContent || ownerRenderer.textContent || '').trim();
          // Debug: log the element and text being picked up
          console.debug('APE debug: ownerAnchor', ownerAnchor, 'text:', text);
          const cleaned = cleanChannelName(text);
          if (cleaned && !isGenericLabel(cleaned) && !isLikelyPlaceholder(cleaned)) ownerAnchorText = cleaned;
        }
    }
  } catch {
    // ignore
  }

  // If we found an owner href, try to extract identifiers from it (channelId, handle, customUrl)
  if (ownerAnchorHref) {
    try {
      const u = new URL(ownerAnchorHref, location.origin);
      const cid = extractChannelIdFromUrl(u.pathname);
      const handle = extractHandleFromUrl(u.pathname);
      const custom = extractCustomUrlFromUrl(u.pathname);

      if (cid) {
        return { channelId: cid, channelName: ownerAnchorText || undefined };
      }

      // Return handle/customUrl even if the visible name is not yet available
      if (ownerAnchorText || handle || custom) {
        return { channelName: ownerAnchorText || undefined, handle: handle || undefined, customUrl: custom || undefined } as any;
      }
    } catch {
      // ignore parse errors
    }
  }

  // 3) Try ytInitialData paths
  const ytInitialData = getYtInitialData();
  if (ytInitialData) {
    const channelIdFromData = extractChannelIdFromYtInitialData(ytInitialData);
    let channelNameFromData = extractChannelNameFromYtInitialData(ytInitialData);
    if (channelNameFromData && isLikelyPlaceholder(channelNameFromData)) channelNameFromData = null;

    // Helper to detect and ignore generic UI labels
    const isGenericLabel = (s?: string) => {
      if (!s) return true;
      const t = s.trim().toLowerCase();
      if (!t) return true;
      const stop = [
        'your videos', 'videos', 'home', 'playlists', 'channels', 'community', 'shorts',
        'about', 'featured channels', 'discussion', 'channels', 'videos 0'
      ];
      if (stop.includes(t)) return true;
      // ignore very short or non-alphabetic labels
      if (t.length < 2) return true;
      if (!/[a-zA-Z\p{L}]/u.test(t)) return true;
      return false;
    };

    // Prefer owner anchor text if it's not a generic label
    let chosenName: string | undefined = undefined;
    if (ownerAnchorText && !isGenericLabel(ownerAnchorText)) chosenName = ownerAnchorText;
    // Fallback to structured data name if owner text is generic
    if (!chosenName && channelNameFromData && !isGenericLabel(channelNameFromData)) chosenName = channelNameFromData;

    const chosenId = channelIdFromData || undefined;
    if (chosenId || chosenName) return { channelId: chosenId, channelName: chosenName };
  }

  // 4) Fallback: scan anchors for first channel link (less reliable)
  try {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
    for (const a of anchors) {
      const href = a.getAttribute('href') || '';
      if (!href) continue;
      if (href.startsWith('javascript:') || href.startsWith('#')) continue;
      try {
        const u = new URL(href, location.origin);
        const cid = extractChannelIdFromUrl(u.pathname);
        if (cid && cid.startsWith('UC')) {
          const cname = a.textContent?.trim() || undefined;
          return { channelId: cid, channelName: cname };
        }
      } catch {
        // ignore invalid URLs
      }
    }
  } catch {
    // ignore
  }

  return null;
}