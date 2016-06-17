function linear() {
	return {
		domain: function( d ){ this.d = d;},
		range: function(){},
		get: function( x ) {
			return ( this.d[1] - x ) / ( this.d[1] - this.d[0] );
		}
	};
}

function create( options, data ) {
	let lin = linear();
	let meta = data.getMetaForSource( options.source );
	lin.domain( [meta.min, meta.max] );
	return lin;
}

export function scale( obj, composer ) {
	let scales = {};
	for ( let s in obj ) {
		scales[s] = create( obj[s], composer.data );
	}
	return scales;
}
