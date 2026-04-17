# Installation Guide

This document provides instructions for setting up and installing the Anti Private Equity Slop Chrome extension.

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Google Chrome (latest version)

## Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd anti-private-equity-slop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Extension

```bash
npm run build
```

This compiles TypeScript files to JavaScript in the `dist/` directory.

### 4. Run Tests

```bash
npm test
```

### 5. Lint Code

```bash
npm run lint
```

Note: ESLint configuration required. Run `npm init @eslint/config` if prompted.

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder

## Project Structure

```
anti-private-equity-slop/
├── dist/              # Compiled extension
├── src/
│   ├── background/    # Service worker
│   ├── content/       # Content scripts
│   ├── shared/        # Shared utilities
│   └── options/       # Options page
├── public/
│   └── locales/       # i18n messages
├── icons/             # Extension icons
├── tests/             # Unit tests
├── manifest.json      # Extension manifest
├── package.json       # npm config
└── tsconfig.json      # TypeScript config
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript |
| `npm run dev` | Watch mode compilation |
| `npm test` | Run unit tests |
| `npm run lint` | Lint code |
| `npm run package` | Build and create zip |

## Troubleshooting

### Extension not loading
- Ensure you're loading the `dist/` folder, not the root
- Check for errors in `chrome://extensions/` console

### Tests failing
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (18+ required)

### Build errors
- Run `npm install` first
- Check TypeScript compilation: `npm run build`