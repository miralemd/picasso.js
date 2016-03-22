let components = {};

/**
 * Add a new component
 * @param {String} name      Name of the component
 * @param {Object} component Component definition
 */
export function addComponent( name, component ) {
	if ( !name ) {
		throw new Error( `Component name is undefined: ${name}` );
	}
	if( !component ) {
		throw new Error( "Component is undefined" );
	}
	if( components[name] ) {
		throw new Error( `Component exists: ${name}` );
	}

	components[name] = component;
}

/**
 * Register all added components to an angular module
 * @param  {Object} module An angular module
 */
export function registerComponents( module ) {
	Object.keys( components ).forEach( name => {
		module.component( name, components[name] );
	} );
}
