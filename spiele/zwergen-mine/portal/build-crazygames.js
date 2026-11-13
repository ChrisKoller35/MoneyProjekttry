// Baut die Fassung für CrazyGames: eine einzige HTML-Datei mit SDK-Skript und Anbindung.
// Aufruf: node build-crazygames.js   -> schreibt dist/crazygames/index.html (Ordner dist wird nicht eingecheckt)
const fs = require('fs'), path = require('path');
const game = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const adapter = fs.readFileSync(path.join(__dirname, 'crazygames-adapter.js'), 'utf8');
const mark = '<script>';
const at = game.indexOf(mark);
if (at < 0 || game.indexOf(mark, at + 1) >= 0) throw new Error('index.html: genau ein <script> erwartet');
const out = game.slice(0, at)
  + '<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>\n<script>\n' + adapter + '</script>\n'
  + game.slice(at);
const dir = path.join(__dirname, 'dist', 'crazygames');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'index.html'), out);
console.log('geschrieben:', path.join(dir, 'index.html'), Math.round(out.length / 1024) + ' KB');
