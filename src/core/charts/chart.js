import { composer } from "./composer/composer";


export default class Chart {
	constructor( element, d, settings ) {
		this.element = element;

		this.element.innerHTML = "";

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
 * chart( element, {
 * 	type: "q",
 * 	data: {
 * 		layout: {...}
 * 	}
 * }, {
 * 	scales: {
 * 		x: {
 * 			source: "/qHyperCube/qMeasureInfo/0"
 * 		},
 * 		y: {
 * 			source: "/qHyperCube/qDimensionInfo/0"
 * 		}
 * 	},
 * 	components: {
 * 		markers: [
 * 			{ type: "point", settings: {
 * 				x: {scale: "x" },
 * 				y: {scale: "y" },
 * 				fill: 'red'
 * 			} }
 * 	    ]
 * 	}
 * } );
 */
export function chart( element, data, settings ) {
	return new Chart( element, data, settings );
}
