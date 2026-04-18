# Anti Private Equity Slop

A privacy-first Chrome extension that warns YouTube viewers when a channel is owned or controlled by private equity interests.

This repository contains the extension source (TypeScript, Manifest V3), build tooling, unit tests, and the local blacklist snapshot used for matching.

## Table of contents

- Quick start
- Installation (from source)
- Development & testing
- Loading the extension in Chrome / Edge
- Architecture overview
- Blacklist snapshot format & development tips
- Privacy
- Contributing
- License

## Quick start

Prerequisites: Node.js and npm (LTS recommended).

Clone the repo, install dependencies, and build:

```bash
git clone https://github.com/your-org/anti-private-equity-slop.git
cd anti-private-equity-slop
npm install
npm run build
```

The build produces a browser-ready `dist/` directory you can load into Chrome or Edge (instructions below).

## Installation (from source)

1. Run `npm install` to install dev dependencies.
2. Build the extension with `npm run build`.
3. Open your browser and load the unpacked extension (see next section).

Note: The repository includes `package.json` scripts used for building, bundling content, linting and testing. Common scripts:

```bash
npm run build      # transpile, copy assets, bundle content
npm run dev        # tsc --watch for iterative development
npm test           # run unit tests (jest)
npm run lint       # run ESLint on source files
npm run package    # build and create extension.zip (Windows PowerShell zip)
```

## Loading the extension in Chrome / Edge

1. Open `chrome://extensions/` (or `edge://extensions/`).
2. Enable **Developer mode** (toggle, top-right).
3. Click **Load unpacked** and choose the `dist/` folder produced by `npm run build`.

This installs the extension locally for testing. To create a distributable ZIP, run `npm run package`.

## Development & testing

- Use `npm run dev` while editing TypeScript to compile incrementally.
- Run `npm test` to execute unit tests (Jest + ts-jest). Tests live under `tests/unit/`.
- Use `npm run lint` to check code style and catch common problems.

If you need to iterate on UI assets or options, rebuild and reload the unpacked extension in the browser.

## Architecture overview

The source lives in `src/` and is organized by runtime role:

- `src/background/` — MV3 service worker. Handles blacklist sync, signature verification, and matching logic.
- `src/content/` — Content scripts that run on YouTube pages: detect channel identity, normalize identifiers, and show the warning banner.
- `src/shared/` — Shared types, schemas, and the matching implementation used by both background and content logic.
- `src/options/` — Minimal options UI and static assets.
- `tests/` — Unit tests for core pieces like the matcher and normalization.

Build output is emitted to `dist/` (loaded into the browser during manual testing).

## Blacklist snapshot & development tips

The extension expects a signed snapshot (JSON) of the blacklist for client-side matching. In production this is fetched from the configured API endpoint, but for local development you can mock or set the snapshot directly in `chrome.storage.local`.

Example snippet to populate a dev snapshot in the browser console:

```javascript
chrome.storage.local.set({
  blacklist: {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    signature: "dev-signature",
    entries: [
      {
        channelId: "UCxxxxxxxxxxxxxxxxxxxxxx",
        channelName: "Example Channel",
        addedAt: new Date().toISOString(),
        reason: "Test entry"
      }
    ]
  }
});
```

See `src/shared/blacklist-schema.ts` for the exact entry shape and validation rules.

## Privacy

- Matching is performed locally in the browser; no browsing history or page content is shipped to external servers.
- The only network requests performed by the extension are read-only fetches of the blacklist snapshot (if enabled).
- The project purposefully avoids analytics and remote telemetry.

## Contributing

We welcome contributions. Please read `CONTRIBUTING.md` for the process of adding blacklist entries, running the helper script, and submitting PRs. Keep changes scoped and include tests for any behavior changes.

## License

This project is released under the MIT License.

---
If you'd like, I can also add a short changelog template, a development checklist, or polish the `package.json` scripts to better match CI workflows.