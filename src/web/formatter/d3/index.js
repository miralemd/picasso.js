import { registry } from "../../../core/utils/registry";
import { formatter as numberFormat } from "./numberFormat";
import { formatter as timeFormat } from "./timeFormat";

function Formatter() {
	let reg = registry();

	reg.add( "number", numberFormat );
	reg.add( "time", timeFormat );

	this.type = ( type ) => reg.has( type ) && reg.get( type )();
	this.has = reg.has;
}

export function formatter() {
	return new Formatter();
}
