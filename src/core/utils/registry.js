export default class Registry {
	/**
	 * @example
	 * var r = new Registry();
	 * r.register( "marker", function( args ) {
	 * 	return new markers[args.type]( args );
	 * } );
	 *
	 * r.build( {
	 * 	marker: {
	 * 		type: "point"
	 * 	}
	 * } );
	 *
	 */
	constructor( reg ) {
		this.registry = reg || {};
	}

	/**
	 * Register a factory function
	 * @param name
	 * @param fn
	 */
	register( name, fn ) {
		if ( !name || typeof name !== "string" ) {
			throw new Error( "Invalid name" );
		}
		if ( typeof fn !== "function" ) {
			throw new TypeError( "fn must be a function" );
		}
		if ( name in this.registry ) {
			throw new Error( `${name} already exists` );
		}
		this.registry[name] = fn;
	}

	/**
	 * Walk through obj properties and call factory function on registered properties
	 * @returns {*}
	 */
	build( obj, options ) {
		let parts = {};

		for ( let name in obj ) {
			if ( this.registry[name] ) {
				parts[name] = this.registry[name]( obj[name], options );
			}
		}

		return parts;
	}
}

export function registry( reg ) {
	return new Registry( reg );
}
