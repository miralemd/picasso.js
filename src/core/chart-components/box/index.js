import { registry } from "../../utils/registry";
import { box } from "./box";
import { candlestick } from "./candlestick";

let reg = registry();

reg.register( "box", box );
reg.register( "candlestick", candlestick );

export function createbox( arr, composer ) {
	let markers = [];
	arr.forEach( marker => {
		if ( marker.type in reg.registry ) {
			markers.push( reg.registry[marker.type]( marker, composer ) );
		}
	} );
	return markers;
}
