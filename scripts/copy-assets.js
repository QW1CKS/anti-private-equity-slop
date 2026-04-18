const fs = require('fs');
const path = require('path');

// Get project root (parent of scripts folder)
const projectRoot = path.join(__dirname, '..');

// Files and directories to copy to dist
const assets = ['manifest.json', 'blacklist.json', 'public', 'icons', 'src/options'];

assets.forEach(asset => {
  const src = path.join(projectRoot, asset);
  // If asset starts with 'src/' or 'src\\', strip the prefix when copying
  const relativeDst = asset.replace(/^src[\\/]/, '');
  const dst = asset.startsWith('src/') || asset.startsWith('src\\')
    ? path.join(projectRoot, 'dist', relativeDst)
    : path.join(projectRoot, 'dist', asset);

  if (!fs.existsSync(src)) {
    console.log(`Skipping ${asset} - not found`);
    return;
  }

  if (fs.statSync(src).isDirectory()) {
    // Recursively copy directory
    function copyDir(srcDir, dstDir) {
      if (!fs.existsSync(dstDir)) {
        fs.mkdirSync(dstDir, { recursive: true });
      }
      fs.readdirSync(srcDir).forEach(item => {
        const srcPath = path.join(srcDir, item);
        const dstPath = path.join(dstDir, item);
        if (fs.statSync(srcPath).isDirectory()) {
          copyDir(srcPath, dstPath);
        } else {
          fs.copyFileSync(srcPath, dstPath);
        }
      });
    }
    copyDir(src, dst);
    console.log(`Copied directory: ${asset}/`);
  } else {
    fs.copyFileSync(src, dst);
    console.log(`Copied: ${asset}`);
  }
});