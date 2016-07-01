// import { registry } from "../../utils/registry";
// import { axisContinuous } from "./axis-continuous";
// import { axisDiscrete } from "./axis-discrete";
import { axis } from "../../../web/axis-svg-renderer";

// let reg = registry();

export function axisFactory( ary, composer ) {
	return ary.map( ( a ) => {
		const scale = composer.scales[a.scale];
		const elm = document.getElementById( a.parent );
		let ax;
		if ( scale.type === "ordinal" ) {
			// Init
		} else {
			ax = axis( elm, scale.scale ).dock( a.dock );
		}

		for ( let setting in a.settings ) {
			if ( a.settings.hasOwnProperty( setting ) ) {
				ax[setting]( a.settings[setting] );
			}
		}

		ax.render();
		return ax;
	} );
}
