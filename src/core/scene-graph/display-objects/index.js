import { create as stage } from "./stage";
import { create as container } from "./container";
import { create as rect } from "./rect";
import { create as circle } from "./circle";
import { registry } from "../../utils/registry";

let reg = registry();

reg.add( "rect", rect );
reg.add( "circle", circle );
reg.add( "stage", stage );
reg.add( "container", container );

export function create( type, input ) {
	return reg.get( type )( input );
}
