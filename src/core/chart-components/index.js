import { registry } from "../utils/registry";
import { create } from "./markers/index";
import { createbox } from "./box/index";

let reg = registry();

reg.register( "markers", create );
reg.register( "box", createbox );

export function components( obj, composer ) {
	return reg.build( obj, composer );
}
