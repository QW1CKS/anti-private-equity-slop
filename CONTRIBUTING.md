# How to contribute channels to the blacklist

Thanks — this project accepts PRs that add channels to the shared blacklist. The easiest way to prepare a correct entry is to run the helper below in your browser console while on a YouTube **channel page** or **any video from that channel**.

Use the script exactly as shown: open the channel page (or open one of their videos), open Developer Tools → Console, paste the snippet and press Enter. The script will attempt to detect the canonical channel ID (the `UC...` ID), fill `channelName`, add any `handles` it can find, set `addedAt` to now, and copy a ready-to-paste JSON object to your clipboard.

Important: Do NOT modify the top-level `version`, `updatedAt`, or `signature` fields in [blacklist.json](blacklist.json). Only append a new object to the `entries` array and provide a clear `reason`.

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
  const docFromText = (t) => { const d = document.implementation.createHTMLDocument('tmp'); d.documentElement.innerHTML = t; return d; };
  const parseChannelIdFromUrl = (u) => { const m = u && u.match(/\/channel\/(UC[0-9A-Za-z_-]+)/); return m ? m[1] : null; };

  const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href;
  let channelId = document.querySelector('meta[itemprop="channelId"]')?.getAttribute('content') || parseChannelIdFromUrl(canonical);
  let channelName = document.querySelector('meta[name="author"]')?.getAttribute('content') || document.title.replace(' - YouTube','').trim();

  const handles = [];
  const handleAnchor = document.querySelector('a[href*="/@"], a[href*="/user/"], a[href*="/c/"], ytd-channel-name a');
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
        const fh = d.querySelector('a[href*="/@"]')?.getAttribute('href') || d.querySelector('a[href*="/user/"]')?.getAttribute('href') || d.querySelector('a[href*="/c/"]')?.getAttribute('href');
        if (fh) {
          const mh2 = fh.match(/\/(?:@([A-Za-z0-9_-]+)|user\/([^/]+)|c\/([^/]+))/);
          if (mh2) handles.push(mh2[1] || mh2[2] || mh2[3]);
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
    reason: 'REPLACE_WITH_REASON'
  };

  const pretty = JSON.stringify(entry, null, 2);
  try {
    await navigator.clipboard.writeText(pretty);
    log('Blacklist entry copied to clipboard. Paste it into the `entries` array in ' + location.origin + '/.../blacklist.json and fill `reason`.');
  } catch (e) {
    log('Could not copy to clipboard; the JSON is printed below:');
    console.log(pretty);
  }
  console.log('Generated entry:', entry);
})();
```

---

## What to paste into [blacklist.json](blacklist.json)

Open `blacklist.json` and append the generated object to the `entries` array. Example entry format (the helper produces the same shape):

```json
{
  "channelId": "UCxxxxxxxxxxxxxxxxxxxxxx",
  "channelName": "Example Channel",
  "handles": ["ExampleHandle"],
  "addedAt": "2026-04-18T00:00:00.000Z",
  "reason": "Short explanation of why this channel should be blacklisted"
}
```

Do not edit `version`, `updatedAt`, or `signature` in the snapshot — only add entries. The maintainers will update snapshot metadata and signature when merging.

## PR checklist

- Create a branch named like `blacklist/add-<channelId-or-handle>`
- Add the new entry to the `entries` array in `blacklist.json` and commit only that change
- In your PR description, include: channel name, channelId (UC...), a short `reason`, and a link to the channel
- Do not modify the top-level `version`, `updatedAt`, or `signature` fields
- Wait for maintainers to run the signature update step and merge

Thanks for helping keep the blacklist current!
