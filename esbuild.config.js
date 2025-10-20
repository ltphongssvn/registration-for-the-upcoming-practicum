// File: esbuild.config.js
// Location: /registration-for-the-upcoming-practicum/esbuild.config.js

const esbuild = require('esbuild')
const path = require('path')

const watch = process.argv.includes('--watch')

async function build() {
  const options = {
    entryPoints: ['app/javascript/application.js'],
    bundle: true,
    sourcemap: true,
    format: 'esm',
    outdir: path.join(process.cwd(), 'app/assets/builds'),
    publicPath: '/assets',
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx'
    }
  }

  if (watch) {
    const ctx = await esbuild.context(options)
    await ctx.watch()
    console.log('Watching for changes...')
  } else {
    await esbuild.build(options)
    console.log('Build complete')
  }
}

build().catch(() => process.exit(1))
