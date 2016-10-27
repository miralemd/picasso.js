import { renderer as rendererFactory } from "../../../renderer";
import { shape as shapeFactory } from "./shapes";

const DEFAULT_DATA_SETTINGS = {
	shape: "circle",
	label: "",
	fill: "#999",
	stroke: "#ccc",
	strokeWidth: 0,
	opacity: 1,
	x: 0.5,
	y: 0.5,
	size: 1
};

/**
 * @typedef marker-point
 * @property {string} type - "point"
 * @property {data-ref} data - Point data.
 * @property {marker-point-settings} settings - Marker settings
 * @example
 * {
 * 	type: "point",
 * 	data: { source: "/qDimensionInfo/0" },
 *	settings: {
 *		x: 0.2, // simple number, places all points at the same position along the x-axis (which assumes to have a range of [0,1])
 *		y: ( d, i, arr ) => i / arr.length, // function is called for each datum `d`
 *		fill: { source: "/qMeasureInfo/0", type: "color" }, // auto-constructs a color scale from the specified source
 *		opacity: { source: "/qMeasureInfo/1", fn: ( d, i ) => d.value },
 *		shape: ( d, i ) => ["rect", "circle"][i % 2]
 *	}
 * }
 */

/**
 * @typedef marker-point-settings
 * @property {marker-point-number} [x=0.5] - x coordinate
 * @property {marker-point-number} [y=0.5] - y coordinate
 * @property {marker-point-string} [fill="#999"] - fill color
 * @property {marker-point-string} [stroke="#ccc"] - stroke color
 * @property {marker-point-number} [strokeWidth=0] - stroke width
 * @property {marker-point-number} [size=1] - size of shape
 * @property {marker-point-number} [opacity=1] - opacity of shape
 * @property {marker-point-string} [shape="circle"] - type of shape
 */

/**
 * @typedef {(string|marker-point-data-accessor|marker-point-data)} marker-point-string
 */

 /**
  * @typedef {(number|marker-point-data-accessor|marker-point-data)} marker-point-number
  */

 /**
  * @callback marker-point-data-accessor
  * @param {object} datum - The datum object
  * @param {string} datum.label - Label of datum
  * @param {number} datum.value - Numeric value of datum
  * @param {string|number} datum.id - Id of datum
  * @param {integer} index - Index of datum in the data
  * @param {datum[]} arr - Array of current data
  */

/**
 * The data to use for encoding a property of the point.
 *
 * The specified source will provide the point marker with data.
 * @typedef marker-point-data
 * @property {string} source - Data field
 * @property {marker-point-data-accessor} [fn] - Data accessor. Custom data accessor which will be called for each datum. The return value is used for the specified property.
 * @property {string} [scale] - Name of a predefined scale. Not used if fn is defined.
 * @example
 * // the following definition will provide data from the first measure in the form: [{value: 3, label: "$3", id: 0}, ...]
 * {
 * 	source: "/qMeasureInfo/0"
 * }
 */

function values( table, setting ) {
	if ( setting && setting.source ) {
		return table.findField( setting.source ).values();
	}
	return null;
}

function prop( stngs, name, composer ) {
	const type = typeof stngs[name];

	if ( type === "undefined" ) {
		return DEFAULT_DATA_SETTINGS[name];
	}
	if ( type === typeof DEFAULT_DATA_SETTINGS[name] ) { // if property is of same primitive type as default, use the provided value
		return stngs[name];
	}
	if ( type === "function" ) { // custom accessor function
		return stngs[name];
	}
	if ( typeof stngs[name].fn === "function" ) { // custom accessor function inside object
		return stngs[name].fn;
	}
	const scale = composer.scale( stngs[name] ); // check if a scale accessor can be created from the given input

	return scale || DEFAULT_DATA_SETTINGS[name];
}

function getSpaceFromScale( s, space ) {
	if ( s && s.scale && typeof s.scale.step === "function" ) { // some kind of ordinal scale
		return Math.max( 1, s.scale.step() * space );
	}
	return Math.max( 1, space / 10 );
}

function getPointSizeLimits( x, y, width, height ) {
	let xSpace = getSpaceFromScale( x, width );
	let ySpace = getSpaceFromScale( y, height );
	let space = Math.min( xSpace, ySpace );
	let min = Math.max( 1, Math.floor( space / 4 ) ); // set min size to be 4 (arbitrary choice) times smaller than allowed space
	let max = Math.max( min, Math.min( Math.floor( space ) ) );
	return [min, max];
}

function calculateLocalSettings( stngs, composer ) {
	let ret = {};
	for ( let s in DEFAULT_DATA_SETTINGS ) {
		ret[s] = prop( stngs, s, composer );
	}
	return ret;
}

function createDisplayPoints( dataPoints, { x, y, width, height }, pointSize, shapeFn ) {
	return dataPoints.filter( p => {
		return !isNaN( p.x + p.y + p.size );
	} ).map( p => {
		return shapeFn( p.shape, {
			label: p.label,
			x: p.x * width,
			y: p.y * height,
			fill: p.fill,
			size: pointSize[0] + p.size * ( pointSize[1] - pointSize[0] ), // TODO - replace with scale
			stroke: p.stroke,
			strokeWidth: p.strokeWidth,
			opacity: p.opacity
		} );
	} );
}

export function pointFn( rendererFn, shapeFn ) {

	let rect = { x: 0, y: 0, width: 0, height: 0 },
		points,
		dataInput,
		local,
		settings,
		composer,
		table,
		renderer;

	let fn = function( obj, comp ) {
		rect = { x: 0, y: 0, width: 0, height: 0 };
		composer = comp;

		settings = obj.settings || {};
		dataInput = obj.data;
		table = composer.table();

		renderer = rendererFn();
		renderer.appendTo( composer.container() );

		fn.onData();
		return fn;
	};

	fn.onData = function() {
		local = calculateLocalSettings( settings, composer );

		const data = values( table, dataInput );
		const dataValues = {};

		for ( let s in DEFAULT_DATA_SETTINGS ) {
			dataValues[s] = values( table, settings[s] ) || data;
		}

		points = data.map( ( p, i ) => {
			const obj = {};
			for ( let s in DEFAULT_DATA_SETTINGS ) {
				obj[s] = typeof local[s] === "function" ? local[s]( dataValues[s][i], i, dataValues[s] ) : local[s];
			}
			return obj;
		} );
	};

	fn.render = function() {
		const { width, height } = rect;
		const pointSize = getPointSizeLimits( local.x, local.y, width, height );
		const displayPoints = createDisplayPoints( points, rect, pointSize, shapeFn );

		renderer.render( displayPoints );
	};

	fn.resize = function( r ) {
		rect = r;
		renderer.size( rect );
	};

	return fn;
}

export function point( obj, composer ) {
	return pointFn( rendererFactory, shapeFactory )( obj, composer );
}
