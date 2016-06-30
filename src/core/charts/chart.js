import { composer } from "./composer/composer";

export default class Chart {
	/**
	 * @typedef Chart.DataProps
	 * @property {string} type - the type of data parser to use
	 * @property {object} data - data property to send to data parser
	 * @example
	 * {
	 * 	type: "q",
	 * 	data: {...}
	 * }
	 */

	/**
	 * @typedef Chart.SettingsProps
	 * @property {Chart.ScaleProps} scales
	 * @property {object} components
	 * @property {Chart.Marker[]} components.markers
	 * @example
	 * {
	 * 	scales: {
	 * 		x: <Chart.ScaleProps>
	 * 	},
	 * 	components: [<Chart.Marker>, <Chart.Marker>]
	 * }
	 */

	/**
	 * @typedef Chart.Marker
	 * @property {string} type - the type of marker
	 * @property {object} settings - settings applied to the marker
	 * @example
	 * {
	 * 	type: "point",
	 * 	settings: {...}
	 * }
	 */

	/**
	 * @typedef Chart.ScaleProps
	 * @property {string} source - The data source used as input when creating the scale
	 * @property {string} [type] - The type of scale to create
	 * @example
	 * {
	 * 	source: "whatever is accepted by the data parser",
	 * 	type: "color"
	 * }
	 */

	/**
	 * @constructor
	 * @param {HTMLElement} element
	 * @param {Chart.DataProps} data
	 * @param {Chart.SettingsProps} settings
	 * @returns {Chart}
	 * @example
	 * chart( element,
	 * {
	 * 	type: "q",
	 * 	data: {
	 * 		layout: {...}
	 * 	}
	 * },
	 * {
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
	 * 			{
	 * 				type: "point",
	 * 				settings: {
	 * 					x: {scale: "x" },
	 * 					y: {scale: "y" },
	 * 					fill: 'red'
	 * 				}
	 * 			}
	 * 		]
	 * 	}
	 * } );
	 */
	constructor( element, d, settings ) {
		this.element = element;

		this.element.innerHTML = "";

		this.composer = composer();
		this.composer.build( element, d, settings );
	}
}

export function chart( element, data, settings ) {
	return new Chart( element, data, settings );
}
