# Anti Private Equity Slop

A Chrome extension that warns YouTube users about channels owned by private equity firms.

## Features

- **Privacy-First**: All matching happens locally in your browser. No browsing data is sent to any server.
- **Automatic Detection**: Automatically detects channel information on YouTube watch and channel pages.
- **Warning Banner**: Non-intrusive banner alerts you when viewing private equity-owned channels.
- **Time-Bounded Dismissal**: Dismiss warnings for 4 hours at a time.
- **Local Blacklist**: Cached blacklist with periodic updates.

## Installation

### From Source

1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" (top right)
6. Click "Load unpacked" and select the `dist` folder

### From Chrome Web Store

Coming soon!

## Development

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## Project Structure

```
src/
├── background/       # Service worker
│   ├── service-worker.ts
│   └── blacklist-sync.ts
├── content/          # Content scripts
│   ├── content-script.ts
│   ├── youtube-detector.ts
│   ├── channel-normalize.ts
│   ├── warning-banner.ts
│   └── i18n.ts
├── shared/           # Shared types and logic
│   ├── types.ts
│   ├── blacklist-schema.ts
│   └── matcher.ts
└── options/          # Options page
    └── details.html
```

## Blacklist API

The extension expects a blacklist API at `https://api.privateequityblacklist.com/v1/`. 

For development, you can mock this by manually populating `chrome.storage.local` with a blacklist snapshot:

```javascript
chrome.storage.local.set({
  blacklist: {
    version: "1.0.0",
    updatedAt: "2024-01-01T00:00:00Z",
    signature: "sig123",
    entries: [
      { channelId: "UC...", channelName: "Channel Name", addedAt: "2024-01-01T00:00:00Z" }
    ]
  }
});
```

## Privacy

- No browsing data leaves your device
- Channel matching happens entirely in the service worker
- Blacklist updates are the only network request (read-only, anonymous)
- No cookies, no tracking, no analytics

## License

MIT