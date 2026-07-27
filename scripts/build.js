import { build } from 'esbuild'

// Both entry points ship minified, so nothing about source formatting can reach dist/.
const sharedOptions = {
  minify: true,
  bundle: true,
  target: 'es2022',
}

await build({
  ...sharedOptions,
  entryPoints: ['builds/cdn.js'],
  outfile: 'dist/cdn.min.js',
  format: 'iife',
})

await build({
  ...sharedOptions,
  entryPoints: ['builds/module.js'],
  outfile: 'dist/esm.min.js',
  format: 'esm',
  platform: 'neutral',
  mainFields: ['main', 'module'],
})
