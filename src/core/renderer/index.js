import { registry } from "../utils/registry";
let prio = [];

let reg = registry();

export function register( type, fn ) {
	if ( reg.add( type, fn ) ) {
		prio.push( type );
	}
}

export function renderer( type = prio[0] ) {
	if ( !reg.has( type ) ) {
		throw new Error( `Renderer of type ${type} does not exist` );
	}
	return reg.get( type )();
}
