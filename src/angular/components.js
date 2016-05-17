let components = {},
	directives = {};

/**
 * Add a new component to the registry
 * @param {String} name      Name of the component
 * @param {Object} component Component definition
 */
export function addComponent( name, component ) {
	if ( !name ) {
		throw new Error( `Component name is undefined: ${name}` );
	}
	if ( !component ) {
		throw new Error( "Component is undefined" );
	}
	if ( components[name] ) {
		throw new Error( `Component exists: ${name}` );
	}

	components[name] = component;
}

/**
 * Add a new directive to the registry
 * @param {string} name      Name of the directive
 * @param {Function} directive The constructor function
 */
export function addDirective( name, directive ) {
	if ( !name ) {
		throw new Error( `Directive name is undefined: ${name}` );
	}
	if ( !directive ) {
		throw new Error( "Directive is undefined" );
	}
	if ( directives[name] ) {
		throw new Error( `Directive exists: ${name}` );
	}
	directives[name] = directive;
}

/**
 * Register all added components to a module
 * @param  {Object} module An angular module
 */
export function registerComponents( module ) {
	Object.keys( components ).forEach( name => {
		module.component( name, components[name] );
	} );
}

/**
 * Register all added directives to a module
 * @param  {Object} module An angular module
 */
export function registerDirectives( module ) {
	Object.keys( directives ).forEach( name => {
		module.directive( name, directives[name] );
	} );
}
