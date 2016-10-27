import { scene as sceneFactory } from "../../../core/scene-graph/scene";
import { registry } from "../../../core/utils/registry";
import { measureText } from "./text-metrics";

let reg = registry();

function renderShapes ( shapes, g ) {
	const alpha = g.globalAlpha;
	shapes.forEach( s => {
		if ( "fill" in s && g.fill !== s.fill ) {
			g.fillStyle = s.fill;
		}
		if ( "stroke" in s && g.stroke !== s.stroke ) {
			g.strokeStyle = s.stroke;
		}
		if ( "opacity" in s && g.globalAlpha !== s.globalAlpha ) {
			g.globalAlpha = s.opacity;
		} else if ( g.globalAlpha !== alpha ) {
			g.globalAlpha = alpha;
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

	let el,
		scene,
		rect = { x: 0, y: 0, width: 0, height: 0 };

	let canvasRenderer = function() {};

	canvasRenderer.element = () => el;

	canvasRenderer.root = () => el;

	canvasRenderer.appendTo = ( element ) => {
		if ( !el ) {
			el = element.ownerDocument.createElement( "canvas" );
			el.style.position = "absolute";
		}

		element.appendChild( el );
	};

	canvasRenderer.render = ( shapes ) => {
		if ( !el ) {
			return Promise.reject();
		}

		let g = el.getContext( "2d" );

		el.style.left = `${rect.x}px`;
		el.style.top = `${rect.y}px`;
		el.width = rect.width;
		el.height = rect.height;

		scene = sceneFn( shapes );

		renderShapes( scene.children, g );

		return Promise.resolve();
	};

	canvasRenderer.clear = () => {
		if ( !el ) {
			return;
		}
		el.width = el.width;
	};

	canvasRenderer.size = ( { x, y, width, height } = {} ) => {
		rect.x = isNaN( x ) ? rect.x : x;
		rect.y = isNaN( x ) ? rect.y : y;
		rect.width = isNaN( width ) ? rect.width : width;
		rect.height = isNaN( height ) ? rect.height : height;
		return rect;
	};

	canvasRenderer.destroy = () => {
		if ( el ) {
			if ( el.parentElement ) {
				el.parentElement.removeChild( el );
			}
			el = null;
		}
		scene = null;
	};

	canvasRenderer.measureText = ( { text, fontSize, fontFamily } ) => {
		return measureText( { text, fontSize, fontFamily } );
	};

	return canvasRenderer;
}

export function register( type, renderFn ) {
	reg.add( type, renderFn );
}
