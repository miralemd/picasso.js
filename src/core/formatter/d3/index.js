import { registry } from "../../../core/utils/registry";
import { formatter as numberFormat } from "./numberFormat";
import { formatter as timeFormat } from "./timeFormat";

let reg = registry();

reg.add( "number", numberFormat );
reg.add( "time", timeFormat );

export default function() {
	function type ( t ) {
		return reg.has( t ) && reg.get( t );
	}

	type.has = function( t ) {
		return reg.has( t );
	};

	return type;
}
