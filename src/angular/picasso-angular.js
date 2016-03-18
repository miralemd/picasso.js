import "./components/component.css";
import { registerComponents } from "./components";

// auto register components
import "./components/axis/axis";
import "./components/barchart/barchart";
import "./components/barchart/bararea";

export default {
	module: undefined,
	/**
	 * Initiate picasso angular module
	 * @param  {Object} [window.angular] angular
	 */
	init( angular = window.angular ) {
		this.module = angular.module( "picasso", [] );

		registerComponents( this.module );
	},

	/**
	 * Bootstrap picasso module
	 * @param  {Object} [window.angular] angular
	 */
	boot( angular = window.angular ) {
		if( !this.module ) {
			this.init( angular );
		}
		angular.bootstrap( document, [this.module.name] );
	}
};
