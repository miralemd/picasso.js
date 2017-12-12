const path = require('path');
const extend = require('extend');

module.exports = function initConfig(baseConfig) {
  return extend(true, {}, baseConfig, {
    seleniumAddress: 'http://seleniumhub.qliktech.com:4444/wd/hub',
    artifactsPath: 'test/integration/artifacts',
    capabilities: {
      browserName: 'chrome',
      chromeOptions: {
        args: ['--disable-gpu']
      }
    },
    mochaOpts: {
      bail: true
    },
    specs: [path.resolve(__dirname, 'test/integration/**/*.int.js')],
    configureHttpServer() {
      return {
        root: path.resolve(__dirname, '../../'),
        rewrite: {
          '/fixtures/(.*)': 'packages/picasso.js/test/integration/$1'
        }
      };
    }
  });
};
