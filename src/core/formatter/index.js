import { registry } from "../utils/registry";

let reg = registry();

export function register( type, fn ) {
	reg.add( type, fn );
}

export function formatter( type ) {
	if ( !reg.has( type ) ) {
		throw new Error( `Formatter of type ${type} does not exist` );
	}
	return reg.get( type )();
}
