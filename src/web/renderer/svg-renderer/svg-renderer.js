/** @module web/renderer/svg-renderer/svg-renderer */

import { tree } from "./svg-tree";
import { svgNs } from "./svg-nodes";
import { scene } from "../../../core/scene-graph/scene";

export default class SVGRenderer {

	constructor( treeFn, ns, sceneFactory ) {
		this.ns = ns;
		this.tree = treeFn();
		this.sceneFactory = sceneFactory;

		this.items = [];
		this.rect = { x: 0, y: 0, width: 0, height: 0 };
	}

	/**
	 * Append the svg renderer to an element.
	 * @param  {HTMLElement} element - The element to append the svg renderer to.
	 */
	appendTo( element ) {
		if ( !this.root ) {
			this.root = element.ownerDocument.createElementNS( this.ns, "svg" );
			this.root.style.position = "absolute";
			this.root.setAttribute( "xmlns", this.ns );
			this.g = element.ownerDocument.createElementNS( this.ns, "g" );
			this.root.appendChild( this.g );
		}
		this.container = element;
		element.appendChild( this.root );
	}

	/**
	 * Render items.
	 * @param  {Object[]} items - Items to render.
	 * @example
	 * renderer.render( [
	 * 	{type: "circle", cx: 50, cy: 20, r: 13},
	 * 	{type: "rect", width: 20, height: 50, fill: "red"}
	 * ] );
	 */
	render( items ) {
		this.rect.width = this.container.clientWidth;
		this.rect.height = this.container.clientHeight;
		this.root.setAttribute( "width", this.rect.width );
		this.root.setAttribute( "height", this.rect.height );

		this.clear();
		this.scene = this.sceneFactory( items );
		this.tree.render( this.scene.children, this.g );
	}

	/**
	 * Clear all content.
	 */
	clear () {
		let g = this.g.cloneNode( false );
		this.root.replaceChild( g, this.g );
		this.g = g;
		this.items = [];
	}

	/**
	 * Clear all content and detach renderer from DOM.
	 */
	destroy () {
		if ( this.root && this.root.parentNode ) {
			this.root.parentNode.removeChild( this.root );
		}
		this.root = null;
		this.g = null;
		this.items = [];
	}

	size () {
		return {
			width: this.container.clientWidth,
			height: this.container.clientHeight
		};
	}
}

export function renderer() {
	return new SVGRenderer( tree, svgNs, scene );
}
