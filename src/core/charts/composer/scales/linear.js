import { linear as lin } from "../../../scales/linear";

function getMinMax( fields ) {
	return {
		min: Math.min( ...fields.map( m => m.min() ) ),
		max: Math.max( ...fields.map( m => m.max() ) )
	};
}

export function linear( fields ) {
	let s = lin();
	let { min, max } = getMinMax( fields );
	s.domain( [min, max] );
	let fn = function( v ) {
		return s.get( v.value );
	};

	fn.scale = s;

	return fn;
}
