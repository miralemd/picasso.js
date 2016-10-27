import { tree as treeFactory } from "./svg-tree";
import { svgNs } from "./svg-nodes";
import { scene } from "../../../core/scene-graph/scene";
import { measureText } from "./text-metrics";

export function renderer( treeFn = treeFactory, ns = svgNs, sceneFn = scene, Promise = window.Promise ) {
	let tree = treeFn(),
		el,
		group,
		rect = { x: 0, y: 0, width: 0, height: 0 };

	let svg = function(){};

	svg.element = () => {
		return el;
	};

	svg.root = () => {
		return group;
	};

	svg.appendTo = ( element ) => {
		if ( !el ) {
			el = element.ownerDocument.createElementNS( ns, "svg" );
			el.style.position = "absolute";
			el.setAttribute( "xmlns", ns );
			group = element.ownerDocument.createElementNS( ns, "g" );
			el.appendChild( group );
		}
		element.appendChild( el );
	};

	svg.render = ( items ) => {
		if ( !el ) {
			return Promise.reject();
		}

		el.style.left = `${rect.x}px`;
		el.style.top = `${rect.y}px`;
		el.setAttribute( "width", rect.width );
		el.setAttribute( "height", rect.height );

		svg.clear();
		let s = sceneFn( items );
		tree.render( s.children, group );

		return Promise.resolve();
	};


	svg.clear = () => {
		if ( !group ) {
			return svg;
		}
		let g = group.cloneNode( false );
		el.replaceChild( g, group );
		group = g;
		return svg;
	};

	svg.destroy = () => {
		if ( el && el.parentElement ) {
			el.parentElement.removeChild( el );
		}
		el = null;
		group = null;
	};

	svg.size = ( { x, y, width, height } = {} ) => {
		rect.x = isNaN( x ) ? rect.x : x;
		rect.y = isNaN( x ) ? rect.y : y;
		rect.width = isNaN( width ) ? rect.width : width;
		rect.height = isNaN( height ) ? rect.height : height;
		return rect;
	};

	svg.measureText = ( { text, fontSize, fontFamily } ) => {
		return measureText( { text, fontSize, fontFamily } );
	};

	return svg;
}
