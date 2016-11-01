import { band } from "../../../scales/band";

function unique( values ) {
	let exists = {};
	return values.filter( v => {
		return exists[v.id] ? false : ( exists[v.id] = true );
	} );
}

export function ordinal( fields, settings ) {
	let s = band();
	let values = fields[0].values();
	let uniq = unique( values ).map( v => v.label );
	s.domain( uniq );
	s.range( settings.invert ? [1, 0] : [0, 1] );
	s.paddingOuter( 1 ); // TODO hard-coded
	s.paddingInner( 1 ); // TODO hard-coded
	s.align( 0.5 ); // TODO hard-coded
	let fn = function( v ) {
		return s.get( v.label );
	};

	fn.scale = s;

	return fn;
}
