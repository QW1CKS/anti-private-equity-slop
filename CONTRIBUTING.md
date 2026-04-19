# How to contribute channels to the blacklist

> [!CAUTION]
> **Only run the console helper script on the actual YouTube channel page** (URL like `youtube.com/channel/UC...` or `youtube.com/@handle`). Do NOT run it on a video page or anywhere else.

**How to use the helper:**
1. Open the channel page for the channel you want to blacklist. (Do **not** use a video page or any other page.)
2. Open Developer Tools → Console.
3. Paste the script below and press Enter.
4. The script will output a ready-to-paste JSON object and copy it to your clipboard.

## Opening Developer Tools and where to paste the helper

If you're not familiar with Developer Tools, use the steps below for your browser. Always paste the helper into the **Console** panel.

- Chrome / Edge:
  - Windows / Linux: press `Ctrl+Shift+I` or `F12`
  - macOS: press `⌥ Option + ⌘ Command + I`
  - Or open the browser menu → More tools → Developer tools, then select the **Console** tab.
- Firefox:
  - Windows / Linux: press `Ctrl+Shift+K`
  - macOS: press `⌘ Command + ⌥ Option + K`
  - Or open the menu → Web Developer → Web Console.
- Safari (macOS):
  - Enable the Develop menu in Safari Preferences → Advanced → check "Show Develop menu in menu bar".
  - Then choose Develop → Show JavaScript Console or press `⌥ Option + ⌘ Command + C`.

Where to paste and run:

- Switch to the **Console** tab (you should see a prompt or an entry area).
- Paste the entire script (including the leading `(() => {` and trailing `})();`).
- Press `Enter` to run the helper. The script will attempt to copy the generated JSON to your clipboard and will also print it in the console.
- If clipboard access is blocked, copy the printed JSON from the console and paste it into `blacklist.json` manually.

Before pasting, double-check the URL bar to confirm you're on the channel page (it should contain `/channel/UC...` or start with `/@`).

**Important:**
- Do **not** modify the top-level `version`, `updatedAt`, or `signature` fields in [blacklist.json](blacklist.json).
- Only append a new object to the `entries` array and provide a clear `reason`.
- The `channelId` (the canonical `UC...` id) is optional — if the helper cannot determine it, the generated entry will omit `channelId`. Include a link to the channel in your PR description so maintainers can resolve the canonical ID before merging.

---


## Console helper (paste this into the Console — on the channel page only)

```javascript
(() => {
  // 1. Sanity check: Ensure they are actually on a channel page
  if (!location.pathname.startsWith('/@') && !location.pathname.startsWith('/channel/')) {
    console.error("❌ ERROR: Please run this on a channel page (e.g., youtube.com/@ChannelName)");
    return;
  }

  // 2. Extract Handle from URL (Always accurate even on SPA navigations)
  const handleMatch = location.pathname.match(/^\/(@[\w.-]+)/);
  const handle = handleMatch ? handleMatch[1] : "";

  // 3. Extract Name from the DOM (Always accurate)
  const nameEl = document.querySelector('ytd-channel-name .yt-core-attributed-string') || document.querySelector('#text.ytd-channel-name');
  const channelName = nameEl ? nameEl.textContent.trim() : document.title.replace(' - YouTube', '').trim();

  // 4. Extract Channel ID (Prone to SPA stale data, so we use a fallback and warning)
  let channelId = "";
  const metaId = document.querySelector('meta[itemprop="identifier"]')?.content;
  const canonicalIdMatch = document.querySelector('link[rel="canonical"]')?.href.match(/channel\/(UC[\w-]+)/);

  if (canonicalIdMatch) {
    channelId = canonicalIdMatch[1];
  } else if (metaId && metaId.startsWith('UC')) {
    channelId = metaId;
  }

  const entry = {
    channelName: channelName,
    handles: handle ? [handle] : [],
    addedAt: new Date().toISOString(),
    reason: "ENTER_REASON_HERE",
    channelId: channelId || "MISSING_ID"
  };

  const pretty = JSON.stringify(entry, null, 2) + ",";
  
  try {
    navigator.clipboard.writeText(pretty);
    console.log("%c✅ Copied to clipboard! Paste it into the `entries` array in blacklist.json.", "color: #00ff00; font-size: 14px; font-weight: bold;");
    
    // Warn the contributor if SPA navigation hid the Channel ID
    if (entry.channelId === "MISSING_ID") {
       console.warn("%c⚠️ Warning: Could not reliably find the Channel ID due to YouTube's dynamic loading. Please press F5 to refresh the page and run the script again.", "color: orange; font-size: 14px;");
    }
  } catch (e) {
    console.log("%c⚠️ Could not auto-copy. Here is the JSON:", "color: orange;");
  }
  
  console.log(pretty);
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
