# Development & Testing Guide

This guide covers how to run the Anti Private Equity Slop extension in development mode and test it in Chrome.

## Prerequisites

- Node.js 18 or higher
- Google Chrome (latest version)
- Git (for cloning the repository)

## Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd anti-private-equity-slop
npm install

# Start development (watch mode)
npm run dev

# In another terminal, build for Chrome
npm run build

# Load in Chrome at chrome://extensions/
```

---

## Development Mode

### Option 1: Watch Mode (Recommended)

Watch mode automatically recompiles TypeScript when files change:

```bash
npm run dev
```

This runs `tsc --watch` and recompiles on every save. You'll need to reload the extension in Chrome manually after each change.

### Option 2: Manual Build

For each code change, rebuild manually:

```bash
npm run build
```

Then reload the extension in Chrome.

---

## Loading the Extension in Chrome

### Step 1: Enable Developer Mode

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **Developer mode** ON (top right corner)

### Step 2: Load Unpacked Extension

1. Click **Load unpacked** button
2. Navigate to the `dist` folder in your project
3. Select the `dist` folder and click OK

The extension should now appear in your extensions list.

### Step 3: Reload After Changes

After making code changes:

1. Run `npm run build` (or wait for watch mode to recompile)
2. In Chrome, go to `chrome://extensions/`
3. Click the **reload icon** on your extension card

Or use the keyboard shortcut: click the extension icon and hold while clicking.

---

## Testing the Extension

### Automated Tests

Run the unit test suite:

```bash
npm test
```

This runs 51 tests covering:
- Channel normalization
- Blacklist matching
- Schema validation

Expected output:
```
Test Suites: 3 passed, 3 total
Tests:       51 passed, 51 total
```

### Manual Testing

#### Test 1: Verify Extension Loads

1. Load the extension (see above)
2. Visit any YouTube page (e.g., youtube.com)
3. Check the extension icon — it should indicate the extension is active

#### Test 2: Add Test Blacklist Data

Since there's no live API, manually populate Chrome storage with test data:

1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Run this script to add a test channel:

```javascript
chrome.storage.local.set({
  blacklist: {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    signature: "test-signature-123",
    entries: [
      {
        channelId: "UCtest123",
        channelName: "Test Private Equity Channel",
        addedAt: new Date().toISOString(),
        reason: "Test entry for development"
      }
    ]
  }
}, () => console.log("Test blacklist set"));
```

4. Visit a YouTube video from channel `UCtest123` (or modify the URL to include a known channel)

#### Test 3: Check Background Script

1. Go to `chrome://extensions/`
2. Click **Service worker** link under your extension
3. Check the DevTools console for log messages:
   - "Blacklist sync requested"
   - "Channel check requested"

#### Test 4: Test Warning Banner

1. Set up test blacklist data (Test 2)
2. Visit a YouTube video from a blacklisted channel
3. The warning banner should appear near the top of the page
4. Test the **Dismiss** button — banner should close
5. Refresh the page — banner should reappear (dismissal is 4-hour suppression)

---

## Testing Checklist

| Test | Status | Notes |
|------|--------|-------|
| `npm run build` passes | ☐ | TypeScript compiles |
| `npm test` passes | ☐ | All 51 tests pass |
| `npm run lint` passes | ☐ | No lint errors |
| Extension loads in Chrome | ☐ | Icon appears in toolbar |
| DevTools console shows logs | ☐ | Service worker active |
| Test blacklist can be set | ☐ | Via DevTools console |
| Warning banner displays | ☐ | On blacklisted channel |
| Dismiss button works | ☐ | Banner closes |

---

## Troubleshooting

### Extension Not Loading

- Ensure you're loading the **dist** folder, not the root project
- Check for TypeScript compilation errors: `npm run build`
- Check Chrome extensions page for error messages

### Tests Failing

- Ensure dependencies installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)

### Banner Not Appearing

- Check DevTools console for errors
- Verify blacklist data is set: `chrome.storage.local.get('blacklist')`
- Ensure you're on a YouTube video page (watch, shorts, or live)

### Service Worker Not Responding

- Click the "Service worker" link on extensions page to open DevTools
- Check for console errors
- Click "Update" button on extensions page to force reload

---

## Development Workflow

1. **Edit code** in `src/`
2. **Build** with `npm run build` (or use `npm run dev` for watch)
3. **Reload** extension in Chrome
4. **Test** functionality
5. **Debug** via DevTools (content script or service worker)
6. **Run tests** with `npm test` before committing

---

## Useful Chrome URLs

| URL | Purpose |
|-----|---------|
| `chrome://extensions/` | Manage extensions |
| `chrome://extensions/?id=<ext-id>` | Open specific extension details |
| DevTools → Console | View content script logs |
| Service worker DevTools | View background script logs |