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
		if ( "stroke-width" in s && g["stroke-width"] !== s["stroke-width"] ) {
			g.lineWidth = s["stroke-width"];
		}
		if ( reg.has( s.type ) ) {
			reg.get( s.type )( s, {
				g,
				doFill: "fill" in s,
				doStroke: "stroke" in s && g.lineWidth !== 0
			} );
		}
		if ( s.children ) {
			renderShapes( s.children, g );
		}
	} );
}

export default class CanvasRenderer {
	constructor( Promise ) {
		this.Promise = Promise;
	}

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
			return this.Promise.resolve();
		}

		c.width = el.clientWidth;
		c.height = el.clientHeight;

		this.scene = scene( shapes );

		renderShapes( this.scene.children, g );

		return this.Promise.resolve();
	}

	size () {
		return {
			width: this.canvas.parentElement.clientWidth,
			height: this.canvas.parentElement.clientHeight
		};
	}
}

export function renderer() {
	return new CanvasRenderer( window.Promise );
}

export function register( type, renderFn ) {
	reg.add( type, renderFn );
}
