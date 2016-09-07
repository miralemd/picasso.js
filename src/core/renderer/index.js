let prio = ["svg"];
let renderers = {};

export function register( type, fn ) {
	if ( !type || typeof type !== "string" ) {
		throw new TypeError( "type must be a string" );
	}
	if ( typeof fn !== "function" ) {
		throw new TypeError( "fn must be a function" );
	}
	if ( type in renderers ) {
		throw new Error( `Renderer of type ${type} already exists` );
	}

	renderers[type] = fn;
}

export function create( type ) {
	if ( typeof type === "undefined" ) {
		// use prio order order if tech available
		type = prio[0];
	}
	if ( !renderers[type] ) {
		throw new Error( `Renderer of type ${type} does not exist` );
	}
	return renderers[type]();
}

export function renderer( ...s ) {
	return create( ...s );
}
