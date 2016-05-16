import pic from "./picasso-angular-core";

// auto register components
import "./components/axis/axis";
import "./components/barchart/barchart";
import "./components/barchart/bararea";

import "./chart";

export default {
	/**
	 * Initiate picasso angular module
	 * @param  {Object} [window.angular] angular
	 */
	init( angular = window.angular ) {
		pic.init( angular );
		return pic.module;
	},

	/**
	 * Bootstrap angular with the picasso module
	 * @param  {Object} [window.angular] angular
	 */
	boot( angular = window.angular ) {
		if ( !pic.module ) {
			this.init( angular );
		}
		angular.bootstrap( document, [pic.module.name] );
	}
};
