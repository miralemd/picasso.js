import { linear } from "../../scales/linear";
import { ordinal } from "../../scales/ordinal";

/*
function ordinal() {
	return {
		domain: function( d ){ this.d = d;},
		range: function(){},
		get: function( x ) {
			let idx = this.d.indexOf( x ),
				t = ( idx ) / this.d.length;
			return t;
		}
	};
}
*/

function getTypeFromMeta( meta ) {
	return "count" in meta ? "ordinal" : "linear";
}

function range( num ) {
	return Array.from( Array( num ).keys() );
}

function create( options, data ) {
	let meta = data.metaOf( options.source ),
		source = options.source,
		type = options.type ? options.type :
			options.colors ? "color" : getTypeFromMeta( meta ),
		s;
	if ( type === "color" ) {
		s = linear();
		s.domain( [meta.min, meta.max] );
		s.range( options.colors );
	}
	else if ( type === "ordinal" ) {
		s = ordinal();
		s.domain( range( meta.count ) );
		s.range( range( meta.count ).map( v => v / ( meta.count - 1 ) ) );
	} else {
		s = linear();
		s.domain( [meta.min, meta.max] );
	}
	return {
		scale: s,
		toValue: function( arr, idx ) {
			if ( type === "ordinal" ) {
				return s.get( idx );
			}
			return s.get( arr[idx].qNum );
		},
		source: source
	};
}

export function scale( obj, composer ) {
	let scales = {};
	for ( let s in obj ) {
		scales[s] = create( obj[s], composer.data );
	}
	return scales;
}
