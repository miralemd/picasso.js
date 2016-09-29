import { registry } from "../../../core/utils/registry";
import { formatter as numberFormat } from "./numberFormat";
import { formatter as timeFormat } from "./timeFormat";

let reg = registry();

reg.add( "number", numberFormat );
reg.add( "time", timeFormat );

export function type( t ) {
	return reg.has( t ) && reg.get( t )();
}

export function has( t ) {
	reg.has( t );
}
