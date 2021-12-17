const dev = process.env.npm_lifecycle_event.includes('dev')

require('esbuild').build({
  entryPoints: [
    'src/js/theme.js',
    'src/js/predictive-search.js',
    'src/js/product.js',
  ],
  outdir: 'assets',
  outExtension: {
    '.js': '.min.js'
  },
  bundle: true,
  minify: !dev,
  watch: dev,
})
