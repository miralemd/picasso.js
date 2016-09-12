import { registry } from "../../utils/registry";
import { box } from "./box";

let reg = registry();

reg.register( "box", box );

export function createbox( arr, composer ) {
	let markers = [];
	arr.forEach( marker => {
		if ( marker.type in reg.registry ) {
			markers.push( reg.registry[marker.type]( marker, composer ) );
		}
	} );
	return markers;
}
