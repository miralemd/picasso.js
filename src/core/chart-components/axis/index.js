import { renderer } from "../../renderer";
import { registry } from "../../utils/registry";
import { axis } from "./axis";

let reg = registry();

reg.register( "axis", axis );

export function axisFactory( axes, composer ) {
	return axes.map( ( axisConfig ) => {
		const rend = renderer( "svg" );
		const element = document.getElementById( axisConfig.parent );
		element.innerHTML = "";
		rend.appendTo( element );

		return reg.registry.axis( axisConfig, composer, rend );
	} );
}
