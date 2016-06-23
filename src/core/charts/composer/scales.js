function linear() {
	return {
		domain: function( d ){ this.d = d;},
		range: function(){},
		get: function( x ) {
			return ( x - this.d[0] ) / ( this.d[1] - this.d[0] );
		}
	};
}

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

function getTypeFromMeta( meta ) {
	return "count" in meta ? "ordinal" : "linear";
}

function range( num ) {
	return Array.from( Array( num ).keys() );
}

function create( options, data ) {
	let meta = data.metaOf( options.source ),
		source = options.source,
		type = options.type || getTypeFromMeta( meta ),
		s;
	if ( type === "ordinal" ) {
		s = ordinal();
		s.domain( range( meta.count ) );
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
		/*
		source: function( cell ) {
			let metaSource = null;
			for ( let i = 0; i < cell.sources.length; i++ ){
				if ( cell.sources[i].source === source ) {
					metaSource = cell.sources[i];
					break;
				}
			}

			if ( metaSource === null ) {
				return null;
			}

			if ( type === "ordinal" ) {
				return s.get( metaSource.localIdx );
			}
			return s.get( cell.value.num );
		}*/
	};
}

export function scale( obj, composer ) {
	let scales = {};
	for ( let s in obj ) {
		scales[s] = create( obj[s], composer.data );
	}
	return scales;
}
