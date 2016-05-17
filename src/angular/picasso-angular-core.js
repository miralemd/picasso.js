import { registerComponents, registerDirectives, addComponent, addDirective } from "./components";

let pic,
	injector,
	compile;

function boot( $compile, $injector ) {
	injector = $injector;
	compile = $compile;
}

export default {
	/**
	 * Initiate the picasso angular module
	 * @param  {object} angular The angular object to create the module from
	 */
	init: function( angular ) {
		if ( pic ) {
			throw new Error( "Picasso module already initiated" );
		}

		pic = angular.module( "picasso", [] )
			.run( ["$compile", "$injector", boot] );

		registerComponents( pic );
		registerDirectives( pic );
	},

	/**
	 * Picasso module
	 * @return {object} The picasso module instance
	 */
	get module() {
		return pic;
	},

	/**
	 * Register a new component
	 * @param  {string} name      Name of the component
	 * @param  {object} component The component definition
	 */
	component: function( name, component ) {
		if ( !pic ) {
			addComponent( name, component );
			return;
		}
		pic.component( name, component );
	},

	/**
	 * Register a new directive
	 * @param  {string}   name Name of the directive
	 * @param  {Function} fn   The directive constructor function
	 */
	directive: function( name, fn ) {
		if ( !pic ) {
			addDirective( name, fn );
			return;
		}
		pic.directive( name, fn );
	},

	/**
	 * Compile a string into a template
	 * @param  {string} s	The string to compile
	 * @return {Function}	The template function
	 */
	compile: function( s ) {
		return compile( s );
	},

	/**
	 * Find a service
	 * @param  {string} s The name of the service
	 * @return {*}      The service
	 */
	getService: function( ...a ) {
		return injector.get( ...a );
	}
};
