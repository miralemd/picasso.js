import { scene as sceneFactory } from "../../../core/scene-graph/scene";
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

export function renderer( sceneFn = sceneFactory, Promise = window.Promise ) {

	let canvas,
		scene;

	let canvasRenderer = function() {};

	canvasRenderer.appendTo = ( element ) => {
		if ( !canvas ) {
			canvas = element.ownerDocument.createElement( "canvas" );
		}

		element.appendChild( canvas );
	};

	canvasRenderer.render = ( shapes ) => {
		if ( !canvas ) {
			return Promise.reject();
		}

		let el = canvas.parentElement,
			g = canvas.getContext( "2d" );

		canvas.width = el.clientWidth;
		canvas.height = el.clientHeight;

		scene = sceneFn( shapes );

		renderShapes( scene.children, g );

		return Promise.resolve();
	};

	canvasRenderer.size = () => {
		return {
			width: canvas ? canvas.parentElement.clientWidth : 0,
			height: canvas ? canvas.parentElement.clientHeight : 0
		};
	};

	canvasRenderer.destroy = () => {
		if ( canvas ) {
			if ( canvas.parentElement ) {
				canvas.parentElement.removeChild( canvas );
			}
			canvas = null;
		}
		scene = null;
	};

	return canvasRenderer;
}

export function register( type, renderFn ) {
	reg.add( type, renderFn );
}
