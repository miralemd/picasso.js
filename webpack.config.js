"use strict"; // eslint-disable-line
/* eslint-env node*/

let path = require( "path" );
let srcDir = path.resolve( __dirname, "src" );
let testDir = path.resolve( __dirname, "test" );

let ExtractTextPlugin = require( "extract-text-webpack-plugin" );

module.exports = {
	entry: {
		"picasso": path.resolve( srcDir, "index" ),
		"generator": path.resolve( testDir, "mocks", "generator", "hypercube-generator" )
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
		new ExtractTextPlugin( "[name].css" )
	]
};
