// Baut aus index.html, js/*.js und fonts/* eine einzige Datei dist/index.html (für Artifact und Portal-Upload).
// Aufruf: node build.js
const fs = require('fs'), path = require('path');
const dir = __dirname;
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
html = html.replace(/<script src="js\/([^"]+)"><\/script>\s*/g, (m, f) => '<script>\n' + fs.readFileSync(path.join(dir, 'js', f), 'utf8') + '\n</script>\n');
// Schriften (SIL Open Font License) direkt einbetten, damit nichts nachgeladen werden muss
html = html.replace(/url\(fonts\/([^)]+)\)/g, (m, f) => 'url(data:font/woff2;base64,' + fs.readFileSync(path.join(dir, 'fonts', f)).toString('base64') + ')');
fs.mkdirSync(path.join(dir, 'dist'), { recursive: true });
fs.writeFileSync(path.join(dir, 'dist', 'index.html'), html);
console.log('dist/index.html', Math.round(html.length / 1024) + ' KB');
