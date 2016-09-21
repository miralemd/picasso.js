import { registry } from "../../utils/registry";
import { ohlc } from "./ohlc";

let reg = registry();

reg.register( "ohlc", ohlc );

export function ohlcFactory( arr, composer ) {
	let markers = [];
	arr.forEach( marker => {
		if ( marker.type in reg.registry ) {
			markers.push( reg.registry[marker.type]( marker, composer ) );
		}
	} );
	return markers;
}
