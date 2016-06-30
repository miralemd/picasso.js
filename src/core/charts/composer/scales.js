import { interpolateViridis } from "d3-scale";
import { linear } from "../../scales/linear";
import { ordinal } from "../../scales/ordinal";

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
		values = [],
		valueIds = [],
		s;
	if ( type === "color" ) {
		s = linear();
		s.domain( [meta.min, meta.max] );
		s.range( [1, 0] );
	}
	else if ( type === "ordinal" ) {
		s = ordinal();
		s.domain( range( meta.count ) );
		s.range( meta.count <= 1 ? [0.5] : range( meta.count ).map( v => v / ( meta.count - 1 ) ) );
	} else {
		s = linear();
		s.domain( [meta.min, meta.max] );
	}
	return {
		scale: s,
		type,
		update: () => {
			values = data.fromSource( source );
			if ( type === "ordinal" ) {
				let ids = [];
				values = values.filter( v => {
					if ( ids.indexOf( v.qElemNumber ) !== -1 ) {
						return false;
					}
					ids.push( v.qElemNumber );
					return true;
				} );
				valueIds = ids;
			}
		},
		toValue: type === "ordinal" ?
			( arr, idx ) => {
				let i = valueIds.indexOf( arr[idx].qElemNumber );
				return s.get( i );
			} :
			type === "color" ?
			( arr, idx ) => {
				return interpolateViridis( s.get( arr[idx].qNum ) );
			} :
			( arr, idx ) => s.get( arr[idx].qNum ),
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
