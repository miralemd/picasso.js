import { registry } from "../utils/registry";
import { components } from "../chart-components/index";

let reg = registry();

reg.register( "components", components );

export default class Chart {
	constructor( element, data, settings ) {
		this.element = element;
		this.data = data;
		this.settings = settings;

		this.parts = reg.build( settings, {
			element,
			data
		} );
	}
}

/**
 *
 * @param element
 * @param data
 * @param settings
 * @returns {Chart}
 * @example
 * chart( element, data, {
 * 	components: {
 * 		markers: [
 * 			{ type: "point", settings: {...} }
 * 	    ]
 * 	}
 * } );
 */
export function chart( element, data, settings ) {
	return new Chart( element, data, settings );
}
