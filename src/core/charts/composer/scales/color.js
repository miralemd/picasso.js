import { linear } from "../../../scales/linear";
import { interpolateViridis } from "d3-scale";

function getMinMax( fields ) {
	return {
		min: Math.min( ...fields.map( m => m.min() ) ),
		max: Math.max( ...fields.map( m => m.max() ) )
	};
}

export function color( fields, settings ) {
	let s = linear();
	let { min, max } = getMinMax( fields );
	s.domain( [min, max] );
	s.range( settings.invert ? [1, 0] : [0, 1] );
	let fn = function( v ) {
		return interpolateViridis( s.get( v.value ) );
	};

	fn.scale = s;

	return fn;
}
