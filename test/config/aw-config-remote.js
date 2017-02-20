var extend = require( "extend" );
var baseConfig = require( "after-work.js/dist/config/conf.js" );
var httpServer = require( "after-work.js/dist/utils" ).httpServer;

var repoConfig = {
  config: {
    beforeLaunch: function() {
      return httpServer({
        server: {
          baseDir: "./",
          routes: {
            "/dist": "dist",
            "/fixtures": "test/integration"
          }
        }
      });
    },
    plugins: [{ path: "../../node_modules/after-work.js/dist/plugins/screenshoter/index.js" }],
    seleniumAddress: "http://seleniumhub.qliktech.com:4444/wd/hub",
    multiCapabilities: [
      { browserName: "chrome" },
      // { browserName: "firefox"	},
      // { browserName: "internet explorer" }
    ]
  }
};

baseConfig.config.multiCapabilities = [];

var merged = extend( true, baseConfig, repoConfig );
exports.config = merged.config;
