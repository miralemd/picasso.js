import { registry } from "../utils/registry";
import { create } from "./markers/index";
import { creategrid } from "./grid/index";

let reg = registry();

reg.register( "markers", create );
reg.register( "grid", creategrid );

export function components( obj, composer ) {
	return reg.build( obj, composer );
}
