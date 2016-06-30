import { create as straight } from "./q/straight-layout";
import { registry } from "../utils/registry";

let reg = registry();

reg.register( "q", straight );

export function data( obj ) {
	if ( obj.type in reg.registry ) {
		return reg.registry[obj.type]( obj.data );
	}
	return null;
}
