import { registry } from "../../utils/registry";
import { point } from "./point";

let reg = registry();

reg.register( "point", point );

export function create( arr, options ) {
	let markers = [];
	arr.forEach( marker => {
		if ( marker.type in reg.registry ) {
			markers.push( reg.registry[marker.type]( marker, options ) );
		}
	} );
	return markers;
}
