const { compile } = require('nexe')

compile({
  input: './app.js',
  name: './release/JobTracker',
  ico: './assets/vtrpc2.ico',
  build: true,
}).then(() => {
  console.log('success')
})