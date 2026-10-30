// Copies the fonts into www/fonts so the app works fully offline.
const fs = require('fs'), path = require('path');
const out = path.join('www', 'fonts');
fs.mkdirSync(out, { recursive: true });
let css = '';
const pkgs = { amiri: [400, 700], 'aref-ruqaa': [400, 700], lexend: [400, 500, 600] };
for (const [pkg, weights] of Object.entries(pkgs)) {
  const dir = path.join('node_modules', '@fontsource', pkg);
  const files = path.join(dir, 'files');
  fs.mkdirSync(path.join(out, pkg), { recursive: true });
  for (const f of fs.readdirSync(files)) {
    if (f.endsWith('.woff2') && !f.includes('italic')) fs.copyFileSync(path.join(files, f), path.join(out, pkg, f));
  }
  for (const w of weights) {
    const c = fs.readFileSync(path.join(dir, w + '.css'), 'utf8');
    css += c.replace(/url\(\.\/files\//g, 'url(' + pkg + '/').replace(/,\s*url\([^)]*\.woff\)\s*format\("woff"\)/g, '') + '\n';
  }
}
fs.writeFileSync(path.join(out, 'fonts.css'), css);
console.log('fonts ready:', css.length, 'bytes of css');
