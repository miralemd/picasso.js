import { registry } from "../utils/registry";
import { default as d3formatter } from "./d3";
import { default as qformatter } from "./q";

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

register( "d3", d3formatter );
register( "q", qformatter );
