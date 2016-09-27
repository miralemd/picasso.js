var extend = require( "extend" );
var baseConfig = require( "@qlik/after-work/dist/config/client.conf.js" );

var repoConfig = {
	config: {
		plugins: [{ path: "../../node_modules/\@qlik/after-work/dist/plugins/screenshoter/index.js" }],
		seleniumAddress: "http://seleniumhub.qliktech.com:4444/wd/hub",
		multiCapabilities: [{
			"browserName": "chrome"
		}]
	}
};

baseConfig.config.multiCapabilities = [];

var merged = extend( true, baseConfig, repoConfig );
exports.config = merged.config;
