/* eslint-env node*/

var path = require( "path" );
var srcDir = path.resolve( __dirname, "src" );

module.exports = {
	entry: {
		index: path.resolve( srcDir, "index" )
	},
	output: {
		path: path.resolve( __dirname, "dist" ),
		filename: "[name].js",
		library: "picasso",
		libraryTarget: "umd"
	},
	debug: true,
	devtool: "source-map",
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader"
			}
		]
	}
};
