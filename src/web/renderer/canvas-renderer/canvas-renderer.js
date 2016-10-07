import { scene as sceneFactory } from "../../../core/scene-graph/scene";
import { registry } from "../../../core/utils/registry";
import { measureText } from "./text-metrics";

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

	let el,
		scene;

	let canvasRenderer = function() {};

	canvasRenderer.element = () => el;

	canvasRenderer.root = () => el;

	canvasRenderer.appendTo = ( element ) => {
		if ( !el ) {
			el = element.ownerDocument.createElement( "canvas" );
		}

		element.appendChild( el );
	};

	canvasRenderer.render = ( shapes ) => {
		if ( !el ) {
			return Promise.reject();
		}

		let parent = el.parentElement,
			g = el.getContext( "2d" );

		el.width = parent.clientWidth;
		el.height = parent.clientHeight;

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

	canvasRenderer.size = () => {
		return {
			width: el ? el.parentElement.clientWidth : 0,
			height: el ? el.parentElement.clientHeight : 0
		};
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
