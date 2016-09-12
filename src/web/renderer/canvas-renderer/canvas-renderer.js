import { scene } from "../../../core/scene-graph/scene";
import { registry } from "../../../core/utils/registry";

let reg = registry();

function renderShapes ( shapes, g ) {
	shapes.forEach( s => {
		if ( "fill" in s && g.fill !== s.fill ) {
			g.fillStyle = s.fill;
		}
		if ( "stroke" in s && g.stroke !== s.stroke ) {
			g.strokeStyle = s.stroke;
		}
		if ( reg.has( s.type ) ) {
			reg.get( s.type )( s, {
				g,
				doFill: "fill" in s,
				doStroke: "stroke" in s
			} );
		}
		if ( s.children ) {
			renderShapes( s.children, g );
		}
	} );
}

export default class CanvasRenderer {
	constructor() {}

	appendTo( element ) {
		if ( !this.canvas ) {
			this.canvas = element.ownerDocument.createElement( "canvas" );
		}

		element.appendChild( this.canvas );
	}

	render( shapes ) {
		let c = this.canvas,
			el = c.parentElement,
			g = c.getContext( "2d" );

		if ( !c ) {
			return;
		}

		c.width = el.clientWidth;
		c.height = el.clientHeight;

		this.scene = scene( shapes );

		renderShapes( this.scene.children, g );
	}

	size () {
		return {
			width: this.canvas.parentElement.clientWidth,
			height: this.canvas.parentElement.clientHeight
		};
	}
}

export function renderer() {
	return new CanvasRenderer();
}

export function register( type, renderFn ) {
	reg.add( type, renderFn );
}
