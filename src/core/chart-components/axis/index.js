import { axisContinuous } from "./axis-continuous";
import { axisDiscrete } from "./axis-discrete";
import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";

export function axisFactory( axes, composer ) {
	return axes.map( ( axisConfig ) => {
		const scale = composer.scales[axisConfig.scale];
		const rend = renderer();
		const element = document.getElementById( axisConfig.parent );
		element.innerHTML = "";
		rend.rect.width = element.getBoundingClientRect().width;
		rend.rect.height = element.getBoundingClientRect().height;
		rend.appendTo( element );

		if ( scale.type === "ordinal" ) {
			return axisDiscrete( axisConfig, composer, rend ).render();
		} else {
			return axisContinuous( axisConfig, composer, rend ).render();
		}
	} );
}
