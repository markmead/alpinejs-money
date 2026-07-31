import { build } from 'esbuild'

const sharedBuildOptions = {
  minify: true,
  bundle: true,
  target: 'es2022',
}

await build({
  ...sharedBuildOptions,
  entryPoints: ['builds/cdn.js'],
  outfile: 'dist/cdn.min.js',
  format: 'iife',
})

await build({
  ...sharedBuildOptions,
  entryPoints: ['builds/module.js'],
  outfile: 'dist/esm.min.js',
  format: 'esm',
  platform: 'neutral',
  mainFields: ['main', 'module'],
})
