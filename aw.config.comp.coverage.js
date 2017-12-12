module.exports = {
  require: ['babel-register', 'babel-helpers'],
  glob: ['*(packages|plugins)/*/test/component/**/*.comp.js'],
  coverage: true,
  nyc: {
    reportDir: 'coverage/component'
  },
  mocha: {
    reporter: 'min'
  }
};
