import { registry } from "../utils/registry";
import { create } from "./markers/index";

let reg = registry();

reg.register( "markers", create );

export function components( obj, options ) {
	return reg.build( obj, options );
}
