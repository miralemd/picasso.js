var extend = require( "extend" );
var baseConfig = require( "after-work.js/dist/config/conf.dev.js" );
var httpServer = require( "after-work.js/dist/utils" ).httpServer;

var repoConfig = {
  config: {
    // multiCapabilities: [
    //   { "browserName": "chrome"	},
    //   { "browserName": "firefox"	},
    //   { "browserName": "egde"}
    // ],
    beforeLaunch: function() {
      return httpServer( {
        server: {
          baseDir: "./",
          routes: {
            "/src": "./src"
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
