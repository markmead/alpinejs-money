build({
  entryPoints: [`builds/cdn.js`],
  outfile: `dist/money.min.js`,
  platform: "browser",
  define: { CDN: true },
});

build({
  entryPoints: [`builds/module.js`],
  outfile: `dist/money.esm.js`,
  platform: "neutral",
  mainFields: ["main", "module"],
});

build({
  entryPoints: [`builds/module.js`],
  outfile: `dist/money.cjs.js`,
  target: ["node10.4"],
  platform: "node",
});

function build(options) {
  options.define || (options.define = {});

  return require("esbuild")
    .build({ ...options, minify: true, bundle: true })
    .catch(() => process.exit(1));
}
