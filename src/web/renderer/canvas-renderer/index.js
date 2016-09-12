import { renderer, register } from "./canvas-renderer";
import { render as rect } from "./shapes/rect";
import { render as circle } from "./shapes/circle";

register( "rect", rect );
register( "circle", circle );

export {
	renderer
};
