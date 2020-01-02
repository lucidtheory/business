module.exports = function babelConfig (api) {
  api.cache(true)
  return {
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-export-default-from',
      ['module-resolver', {
        root: ['./scripts'],
        extensions: ['.js']
      }]
    ]
  }
}
