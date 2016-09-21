import { registry } from "../../utils/registry";
import { bar } from "./bar";
import { candlestick } from "./candlestick";
import { gantt } from "./gantt";


let reg = registry();

reg.register( "bar", bar );
reg.register( "candlestick", candlestick );
reg.register( "gantt", gantt );

export function createbox( arr, composer ) {
	let markers = [];
	arr.forEach( marker => {
		if ( marker.type in reg.registry ) {
			markers.push( reg.registry[marker.type]( marker, composer ) );
		}
	} );
	return markers;
}
