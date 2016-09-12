import { registry } from "../utils/registry";
import { create } from "./markers/index";
import { createbox } from "./box/index";
import { creategrid } from "./grid/index";
import { axisFactory } from "./axis/index";
import { textFactory } from "./text/index";

let reg = registry();

reg.register( "markers", create );
reg.register( "box", createbox );
reg.register( "grid", creategrid );
reg.register( "axes", axisFactory );
reg.register( "texts", textFactory );


export function components( obj, composer ) {
	return reg.build( obj, composer );
}
