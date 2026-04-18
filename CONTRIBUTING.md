# How to contribute channels to the blacklist

Thanks — this project accepts PRs that add channels to the shared blacklist. The easiest way to prepare a correct entry is to run the helper below in your browser console while on a YouTube **channel page** or **any video from that channel**.

Use the script exactly as shown: open the channel page (or open one of their videos), open Developer Tools → Console, paste the snippet and press Enter. The script will attempt to detect the canonical channel ID (the `UC...` ID), fill `channelName`, add any `handles` it can find, set `addedAt` to now, and copy a ready-to-paste JSON object to your clipboard.

Important: Do NOT modify the top-level `version`, `updatedAt`, or `signature` fields in [blacklist.json](blacklist.json). Only append a new object to the `entries` array and provide a clear `reason`. Note: the `channelId` (the canonical `UC...` id) is optional — if the helper cannot determine it, the generated entry will omit `channelId`. Include a link to the channel in your PR description so maintainers can resolve the canonical ID before merging.

---

## Console helper (paste this into the Console)

```javascript
(async () => {
  const log = (...a) => console.log('contrib-helper:', ...a);
  const warn = (...a) => console.warn('contrib-helper:', ...a);
  const err = (...a) => console.error('contrib-helper:', ...a);

  if (!/\b(youtube\.com|youtu\.be)\b/.test(location.hostname)) {
    err('Not a YouTube page. Open the channel page or a video from that channel and run this script.');
    return;
  }

  const now = new Date().toISOString();
  const docFromText = (t) => new DOMParser().parseFromString(t, 'text/html');
  const parseChannelIdFromUrl = (u) => { const m = u && u.match(/\/channel\/(UC[0-9A-Za-z_-]+)/); return m ? m[1] : null; };

  const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href;
  let channelId = document.querySelector('meta[itemprop="channelId"]')?.getAttribute('content') || parseChannelIdFromUrl(canonical);
  let channelName = document.querySelector('meta[name="author"]')?.getAttribute('content') || document.title.replace(' - YouTube','').trim();

  const handles = [];
  const handleAnchor = document.querySelector('a[href*="/@"], a[href*="/user/"], a[href*="/c/"], a[href^="/channel/"], ytd-channel-name a, ytd-video-owner-renderer a');
  if (handleAnchor) {
    const h = handleAnchor.getAttribute('href');
    const mh = h && h.match(/\/(?:@([A-Za-z0-9_-]+)|user\/([^/]+)|c\/([^/]+))/);
    const candidate = mh ? (mh[1] || mh[2] || mh[3]) : null;
    if (candidate) handles.push(candidate.startsWith('@') ? candidate : candidate);
  }

  // If we don't have the UC... channel ID yet, try fetching the canonical page (helps for /c/ and /user/ pages)
  if (!channelId) {
    try {
      const path = handleAnchor?.getAttribute('href') || canonical;
      const url = path.startsWith('http') ? path : 'https://www.youtube.com' + path;
      const res = await fetch(url, { credentials: 'include' });
      const txt = await res.text();
      const d = docFromText(txt);
      channelId = channelId || d.querySelector('meta[itemprop="channelId"]')?.getAttribute('content') || parseChannelIdFromUrl(d.querySelector('link[rel="canonical"]')?.href);
      channelName = channelName || d.querySelector('meta[name="author"]')?.getAttribute('content') || channelName;
      if (!handles.length) {
        const fh = d.querySelector('a[href*="/@"]')?.getAttribute('href') || d.querySelector('a[href*="/user/"]')?.getAttribute('href') || d.querySelector('a[href*="/c/"]')?.getAttribute('href') || d.querySelector('a[href^="/channel/"]')?.getAttribute('href');
        if (fh) {
          const mh2 = fh.match(/\/(?:@([A-Za-z0-9_-]+)|user\/([^/]+)|c\/([^/]+))/);
          if (mh2) handles.push(mh2[1] || mh2[2] || mh2[3]);
        }
      }
      // Fallback: scan inline scripts in the fetched page for a channelId pattern
      if (!channelId) {
        const scripts = Array.from(d.getElementsByTagName('script'));
        for (const s of scripts) {
          const text = s.textContent || '';
          const m = text.match(/"channelId"\s*:\s*"(UC[0-9A-Za-z_-]+)"/) || text.match(/(UC[0-9A-Za-z_-]{20,})/);
          if (m) { channelId = m[1] || m[0]; break; }
        }
      }
    } catch (e) {
      warn('Could not fetch channel page to resolve aliases; you can open the channel page directly and run the script again.');
    }
  }

  if (!channelId) {
    err('Could not determine a canonical channel ID (UC...). Please open the channel page directly and run the script again.');
    return;
  }

  const entry = {
    channelId,
    channelName: channelName || 'UNKNOWN',
    handles: handles.length ? handles : undefined,
    addedAt: now,
    ```javascript
    (async () => {
      const log = (...a) => console.log('contrib-helper:', ...a);
      const warn = (...a) => console.warn('contrib-helper:', ...a);
      const err = (...a) => console.error('contrib-helper:', ...a);

      if (!/\b(youtube\.com|youtu\.be)\b/.test(location.hostname)) {
        err('Not a YouTube page. Open the channel page or a video from that channel and run this script.');
        return;
      }

      const now = new Date().toISOString();
      const docFromText = (t) => new DOMParser().parseFromString(t, 'text/html');
      const parseChannelIdFromUrl = (u) => { const m = u && u.match(/\/channel\/(UC[0-9A-Za-z_-]+)/); return m ? m[1] : null; };

      const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href;
      let channelId = document.querySelector('meta[itemprop="channelId"]')?.getAttribute('content') || parseChannelIdFromUrl(canonical);
      let channelName = document.querySelector('meta[name="author"]')?.getAttribute('content') || document.title.replace(' - YouTube','').trim();

      const handles = [];
      const handleAnchor = document.querySelector('a[href*="/@"], a[href*="/user/"], a[href*="/c/"], a[href^="/channel/"], ytd-channel-name a, ytd-video-owner-renderer a');
      if (handleAnchor) {
        const h = handleAnchor.getAttribute('href');
        const mh = h && h.match(/\/(?:@([A-Za-z0-9_-]+)|user\/([^/]+)|c\/([^/]+))/);
        const candidate = mh ? (mh[1] || mh[2] || mh[3]) : null;
        if (candidate) handles.push(candidate.startsWith('@') ? candidate : candidate);
      }

      if (!channelId) {
        try {
          const path = handleAnchor?.getAttribute('href') || canonical;
          const url = path.startsWith('http') ? path : 'https://www.youtube.com' + path;
          const res = await fetch(url, { credentials: 'include' });
          const txt = await res.text();
          const d = docFromText(txt);
          channelId = channelId || d.querySelector('meta[itemprop="channelId"]')?.getAttribute('content') || parseChannelIdFromUrl(d.querySelector('link[rel="canonical"]')?.href);
          channelName = channelName || d.querySelector('meta[name="author"]')?.getAttribute('content') || channelName;
          if (!handles.length) {
            const fh = d.querySelector('a[href*="/@"]')?.getAttribute('href') || d.querySelector('a[href*="/user/"]')?.getAttribute('href') || d.querySelector('a[href*="/c/"]')?.getAttribute('href') || d.querySelector('a[href^="/channel/"]')?.getAttribute('href');
            if (fh) {
              const mh2 = fh.match(/\/(?:@([A-Za-z0-9_-]+)|user\/([^/]+)|c\/([^/]+))/);
              if (mh2) handles.push(mh2[1] || mh2[2] || mh2[3]);
            }
          }
          if (!channelId) {
            const scripts = Array.from(d.getElementsByTagName('script'));
            for (const s of scripts) {
              const text = s.textContent || '';
              const m = text.match(/"channelId"\s*:\s*"(UC[0-9A-Za-z_-]+)"/) || text.match(/(UC[0-9A-Za-z_-]{20,})/);
              if (m) { channelId = m[1] || m[0]; break; }
            }
          }
        } catch (e) {
          warn('Could not fetch channel page to resolve aliases; you can open the channel page directly and run the script again.');
        }
      }

      if (!channelId) {
        warn('Canonical channel ID not found; the generated entry will omit `channelId`. Maintainers may resolve it before merging. Include a link to the channel in your PR description.');
      }

      const entry = {
        channelName: channelName || 'UNKNOWN',
        addedAt: now,
        reason: 'REPLACE_WITH_REASON'
      };
      if (handles.length) entry.handles = handles;
      if (channelId) entry.channelId = channelId;

      const pretty = JSON.stringify(entry, null, 2);
      try {
        await navigator.clipboard.writeText(pretty);
        log('Blacklist entry copied to clipboard. Paste it into the `entries` array in ' + location.origin + '/.../blacklist.json and fill `reason`.');
        if (!channelId) log('Note: `channelId` is missing; include channel link in your PR description so maintainers can resolve it.');
      } catch (e) {
        log('Could not copy to clipboard; the JSON is printed below:');
        console.log(pretty);
      }
      console.log('Generated entry:', entry);
    })();
    ```

    ---

    ## What to paste into [blacklist.json](blacklist.json)
