---
# How to contribute channels to the blacklist



<p align="center">
<strong>
<span style="color:red; font-size:1.2em;">
🚨 <span style="color:red;">WARNING:</span> Run the script <u>ONLY</u> on the YouTube <b>channel page</b> (URL like <code>youtube.com/channel/UC...</code> or <code>youtube.com/@handle</code>).<br>
<span style="color:red;">Do <u>NOT</u> run it on a video page or anywhere else!</span>
</span>
</strong>
</p>

**How to use the helper:**
1. Open the channel page for the channel you want to blacklist. (Do **not** use a video page or any other page.)
2. Open Developer Tools → Console.
3. Paste the script below and press Enter.
4. The script will output a ready-to-paste JSON object and copy it to your clipboard.

**Important:**
- Do **not** modify the top-level `version`, `updatedAt`, or `signature` fields in [blacklist.json](blacklist.json).
- Only append a new object to the `entries` array and provide a clear `reason`.
- The `channelId` (the canonical `UC...` id) is optional — if the helper cannot determine it, the generated entry will omit `channelId`. Include a link to the channel in your PR description so maintainers can resolve the canonical ID before merging.

---


## Console helper (paste this into the Console — on the channel page only)

```javascript
(async () => {
  const log = (...a) => console.log('contrib-helper:', ...a);
  const warn = (...a) => console.warn('contrib-helper:', ...a);
  const err = (...a) => console.error('contrib-helper:', ...a);

  if (!/\b(youtube\.com|youtu\.be)\b/.test(location.hostname)) {
    err('Not a YouTube page. Open the actual channel page and run this script.');
    return;
  }
  // Strongly recommend running ONLY on the channel page, not on a video or elsewhere
  if (!/^\/(@[\w-]+|channel\/UC[\w-]+)\/?$/.test(location.pathname)) {
    err('You are NOT on a channel page. Please go to the channel page (URL like youtube.com/@handle or youtube.com/channel/UC...) and run this script there.');
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

Open `blacklist.json` and append the generated object to the `entries` array. Example entry format (the helper produces the same shape):

```json
{
  "channelName": "Example Channel",
  "handles": ["ExampleHandle"],
  "addedAt": "2026-04-18T00:00:00.000Z",
  "reason": "Short explanation of why this channel should be blacklisted",
  "channelId": "UCxxxxxxxxxxxxxxxxxxxxxx" // optional
}
```

Do not edit `version`, `updatedAt`, or `signature` in the snapshot — only add entries. The maintainers will update snapshot metadata and signature when merging.

## PR checklist

- Create a branch named like `blacklist/add-<channelId-or-handle>`
- Add the new entry to the `entries` array in `blacklist.json` and commit only that change
- In your PR description, include: channel name, channelId (if available), a short `reason`, and a link to the channel
- Do not modify the top-level `version`, `updatedAt`, or `signature` fields
- Wait for maintainers to run the signature update step and merge

---
