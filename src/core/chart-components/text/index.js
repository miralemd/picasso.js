import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";
import { text } from "./text";
import { registry } from "../../utils/registry";

let reg = registry();
reg.register( "text", text );

export function textFactory( texts, composer ) {
	return texts.map( ( config ) => {
		const rend = renderer();
		const element = document.getElementById( config.parent );
		element.innerHTML = "";
		rend.rect.width = element.getBoundingClientRect().width;
		rend.rect.height = element.getBoundingClientRect().height;
		rend.appendTo( element );

		return reg.registry.text( config, composer, rend );
	} );
}
