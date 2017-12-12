module.exports = {
  require: ['babel-register', 'babel-helpers'],
  glob: ['*(packages|plugins)/*/test/unit/**/*.spec.js'],
  coverage: true,
  nyc: {
    reportDir: 'coverage/unit'
  },
  mocha: {
    reporter: 'min'
  }
};
