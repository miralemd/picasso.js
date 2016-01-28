import "./components/component.css";
import axisDirective from "./components/axis/axis";
import barchartDirective from "./components/barchart/barchart";
import barareaDirective from "./components/barchart/bararea";

export default {
	module: undefined,
	init( angular = window.angular ) {
		this.module = angular.module( "picasso", [] );

		// register directives
		this.module.directive( "picAxis", axisDirective );
		this.module.directive( "picBarchart", barchartDirective );
		this.module.directive( "picBararea", barareaDirective );
	},
	boot( angular = window.angular ) {
		if( !this.module ) {
			this.init( angular );
		}
		angular.bootstrap( document, [this.module.name] );
	}
};
