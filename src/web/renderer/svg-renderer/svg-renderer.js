import { createTree } from "../node-tree";
import { svgNs, creator, maintainer, destroyer } from "./svg-nodes";

export default class SVGRenderer {
	constructor() {
		this.items = [];
		this.rect = {x: 0, y: 0, width: 0, height: 0};
	}

	appendTo( element ) {
		this.root = element.ownerDocument.createElementNS( svgNs, "svg" );
		this.root.setAttribute( "xmlns", svgNs );
		this.g = element.ownerDocument.createElementNS( svgNs, "g" );
		this.root.appendChild( this.g );

		element.appendChild( this.root );
	}

	render( items ) {
		this.root.setAttribute( "width", this.rect.width );
		this.root.setAttribute( "height", this.rect.height );

		this.items = createTree( this.items, items, this.g, creator, maintainer, destroyer );
	}

	clear () {
		let g = this.g.cloneNode( false );
		this.root.replaceChild( g, this.g );
		this.g = g;
		this.items = [];
	}

	destroy () {
		if( this.root && this.root.parentNode ) {
			this.root.parentNode.removeChild( this.root );
		}
		this.root = null;
		this.g = null;
	}
}
