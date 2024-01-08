const { build } = require('esbuild')
const path = require('path')
const fg = require('fast-glob')
const fs = require('fs')

const root = process.cwd()
const entryPoints = fg.sync(path.resolve(root, 'src/**/*.ts'))
const outdir = path.resolve(root, 'dist')

if (fs.existsSync(outdir)) {
  fs.rmSync(outdir, { recursive: true })
}

const sharedConfig = {
  entryPoints,
  outdir,
  bundle: false,
  platform: 'node',
}

build({
  format: 'esm',
  outExtension: { '.js': '.mjs' },
  ...sharedConfig,
})

build({
  format: 'cjs',
  ...sharedConfig,
})
