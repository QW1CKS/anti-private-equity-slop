#!/usr/bin/env node
// Bundle the content script into a single non-module file using esbuild
const esbuild = require('esbuild');
const path = require('path');

const entry = path.join(__dirname, '..', 'dist', 'content', 'content-script.js');
const tempOut = path.join(__dirname, '..', 'dist', 'content', 'content-script.bundled.js');

(async () => {
  try {
    await esbuild.build({
      entryPoints: [entry],
      outfile: tempOut,
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: ['es2022'],
      sourcemap: true,
      logLevel: 'info',
    });

    // Replace original file with bundled output
    const fs = require('fs');
    fs.copyFileSync(tempOut, entry);
    fs.unlinkSync(tempOut);

    console.log('Bundled content script:', entry);
  } catch (err) {
    console.error('esbuild failed:', err);
    process.exit(1);
  }
})();
