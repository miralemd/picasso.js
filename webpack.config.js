/* eslint-env node*/

var path = require( "path" );
var srcDir = path.resolve( __dirname, "src" );

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: {
		"picasso": path.resolve( srcDir, "index" )
	},
	output: {
		path: path.resolve( __dirname, "dist" ),
		filename: "[name].js",
		library: "[name]",
		libraryTarget: "umd"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract( "css!less" )
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("[name].css")
	]
};
