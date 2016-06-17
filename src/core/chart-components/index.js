import { registry } from "../utils/registry";
import { create } from "./markers/index";

let reg = registry();

reg.register( "markers", create );

export function components( obj, composer ) {
	return reg.build( obj, composer );
}
