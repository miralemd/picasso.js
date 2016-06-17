import { composer } from "./composer/composer";


export default class Chart {
	constructor( element, d, settings ) {
		this.element = element;

		this.composer = composer();
		this.composer.build( element, d, settings );
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
