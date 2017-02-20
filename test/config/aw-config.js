var extend = require( "extend" );
var baseConfig = require( "after-work.js/dist/config/conf.dev.js" );
var httpServer = require( "after-work.js/dist/utils" ).httpServer;

var repoConfig = {
  config: {
    // directConnect: false,
    // multiCapabilities: [
    //   { "browserName": "chrome"	},
    //   { "browserName": "firefox"	},
    //   { "browserName": "internet explorer" }
    // ],
    beforeLaunch: function() {
      return httpServer( {
        server: {
          baseDir: "./",
          routes: {
            "/dist": "dist",
            "/fixtures": "test/integration"
          }
        },
        scrollRestoreTechnique: "cookie"
      } );
    },
    capabilities: {
      chromeOptions: {
        args: ["--disable-gpu"]
      }
    },
    plugins: [{ path: "../../node_modules/after-work.js/dist/plugins/screenshoter/index.js" }]
  }
};

var merged = extend( true, baseConfig, repoConfig );

exports.config = merged.config;
