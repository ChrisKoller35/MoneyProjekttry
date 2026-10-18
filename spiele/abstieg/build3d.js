// Bündelt die 3D-Darstellung (src3d/draw3.js samt three.js) zu js/draw3.js, verkleinert.
// Aufruf: npm install (einmalig, holt three.js und esbuild), dann node build3d.js
const fs = require('fs'), path = require('path');
const esbuild = require('esbuild');
const lic = fs.readFileSync(path.join(__dirname, 'node_modules', 'three', 'LICENSE'), 'utf8').trim().split('\n').map(l => ' * ' + l).join('\n');
esbuild.buildSync({
  entryPoints: [path.join(__dirname, 'src3d', 'draw3.js')],
  bundle: true, minify: true, format: 'iife', target: ['es2019'], legalComments: 'none',
  outfile: path.join(__dirname, 'js', 'draw3.js'),
  banner: { js: '/* Der Abstieg – 3D-Darstellung. Erzeugt aus src3d/draw3.js mit three.js (node build3d.js), nicht von Hand ändern.\n * three.js: https://threejs.org\n' + lic + '\n */' },
});
const kb = Math.round(fs.statSync(path.join(__dirname, 'js', 'draw3.js')).size / 1024);
console.log('js/draw3.js', kb + ' KB');
