import { interpolateViridis } from "d3-scale";
import { linear } from "../../scales/linear";
// import { ordinal } from "../../scales/ordinal";
import { band } from "../../scales/band";

function getTypeFromMeta( meta ) {
	return "count" in meta ? "ordinal" : "linear";
}

function getMeta( data, source ) {
	if ( Array.isArray( source ) ) {
		return source.map( ( s ) => {
			return data.metaOf( s );
		} );
	} else {
		const meta = data.metaOf( source );
		return Array.isArray( meta ) ? meta : [ meta ];
	}
}

function getMinMax( metaInfos ) {
	const min = Math.min.apply( Math, metaInfos.map( ( m ) => { return m.min; } ) );
	const max = Math.max.apply( Math, metaInfos.map( ( m ) => { return m.max; } ) );
	return { min: min, max: max };
}

function range( num ) {
	return Array.from( Array( num ).keys() );
}

function create( options, data ) {
	let meta = getMeta( data, options.source ),
		source = options.source,
		type = options.type ? options.type :
			options.colors ? "color" : getTypeFromMeta( meta[0] ),
		values = [],
		valueIds = [],
		s;
	if ( type === "color" ) {
		s = linear();
		s.domain( [meta[0].min, meta[0].max] );
		s.range( [1, 0] );
	}
	else if ( type === "ordinal" ) {
		s = band();
		s.domain( range( meta[0].count ) );
		s.range( [0, 1] );
		s.paddingOuter( 1 ); // TODO hard-coded
		s.paddingInner( 1 ); // TODO hard-coded
		s.align( 0.5 ); // TODO hard-coded
	} else {
		const d = getMinMax( meta );
		s = linear();
		//s.domain( [0, 1] ); // fulhack
		//s.domain( [meta.min, meta.max] );
		s.domain( [d.min, d.max] );
	}
	return {
		scale: s,
		type,
		meta: meta,
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
		extent: ( arr ) => {
			let vals = arr.map( d => d.qNum );
			return [ Math.min( ...vals ), Math.max( ...vals ) ];
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
