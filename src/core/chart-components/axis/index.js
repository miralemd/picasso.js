import AxisContinuous from "./axis-continuous";
import AxisDiscrete from "./axis-discrete";
import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";

export function axisFactory( axes, composer ) {
	return axes.map( ( axisConfig ) => {
		const scale = composer.scales[axisConfig.scale];
		// const elm = document.getElementById( config.parent );
		const rend = renderer();
		const element = document.getElementById( axisConfig.parent );
		element.innerHTML = "";
		rend.rect.width = element.getBoundingClientRect().width;
		rend.rect.height = element.getBoundingClientRect().height;
		rend.appendTo( element );

		let ax;
		if ( scale.type === "ordinal" ) {
			ax = new AxisDiscrete( axisConfig, composer, rend );
		} else {
			ax = new AxisContinuous( axisConfig, composer, rend );
		}

		ax.dock( axisConfig.dock )
			.settings( axisConfig.settings )
			// .transform( ax.rect.x, 50 )
			// .size( ax.rect.width, ax.rect.height - 50 )
			.render();
		return ax;
	} );
}
