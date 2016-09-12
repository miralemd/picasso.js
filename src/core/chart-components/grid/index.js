import { registry } from "../../utils/registry";
import { line } from "./line";

let reg = registry();

reg.register( "line", line );

export function creategrid( arr, composer ) {
	let items = [];
	arr.forEach( item => {
		if ( item.type in reg.registry ) {
			items.push( reg.registry[item.type]( item, composer ) );
		}
	} );
	return items;
}
