"use strict"; // eslint-disable-line
/* eslint-env node*/

let path = require( "path" );
let srcDir = path.resolve( __dirname, "src" );
let testDir = path.resolve( __dirname, "test" );

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
				query: {
					presets: ["es2015"] // need to have this here instead of in .babelrc until after-work bumps babel dependecy to ^6.0.0
				},
				exclude: /node_modules/
			}
		]
	}
};
