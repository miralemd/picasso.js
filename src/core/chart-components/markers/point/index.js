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
			x: p.x * width + x,
			y: ( 1 - p.y ) * height + y,
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

		settings = obj.settings;
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
	};

	return fn;
}

export function point( obj, composer ) {
	return pointFn( rendererFactory, shapeFactory )( obj, composer );
}
