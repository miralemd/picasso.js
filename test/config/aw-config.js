/*global browser*/
var extend = require( "extend" );
var baseConfig = require( "../../node_modules/@qlik/after-work/dist/config/client.conf.dev.js" );
var httpServer = require( "../../node_modules/@qlik/after-work/dist/utils" ).httpServer;

var repoConfig = {
	config: {
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
		// onPrepare: function() {
		// 	browser.artifactsPath = "test/component/artifacts";
		// 	browser.manage().timeouts().pageLoadTimeout( 40000 );
		// 	browser.manage().timeouts().implicitlyWait( 25000 );
		// },
		plugins: [{ path: "../../node_modules/\@qlik/after-work/dist/plugins/screenshoter/index.js" }]
	}
};

var merged = extend( true, baseConfig, repoConfig );

exports.config = merged.config;
