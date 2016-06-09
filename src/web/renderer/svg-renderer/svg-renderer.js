import { tree } from "./svg-tree";
import { svgNs } from "./svg-nodes";

export default class SVGRenderer {
	/**
	 * Constructor
	 * @param  {TreeCreator} treeCreator - Function used to create the DOM tree..
	 * @param  {SVGCreator} nodeCreator - Function used to create nodes.
	 * @param  {SVGMaintainer} nodeMaintainer - Function used to update nodes.
	 * @param  {SVGDestroyer} nodeDestroyer - Function used to destroy nodes.
	 */
	constructor( tree, ns ) {
		this.ns = ns;
		this.tree = tree();

		this.items = [];
		this.rect = {x: 0, y: 0, width: 0, height: 0};
	}

	/**
	 * Append the svg renderer to an element.
	 * @param  {HTMLElement} element - The element to append the svg renderer to.
	 */
	appendTo( element ) {
		if( !this.root ) {
			this.root = element.ownerDocument.createElementNS( this.ns, "svg" );
			this.root.setAttribute( "xmlns", this.ns );
			this.g = element.ownerDocument.createElementNS( this.ns, "g" );
			this.root.appendChild( this.g );
		}

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
		this.root.setAttribute( "width", this.rect.width );
		this.root.setAttribute( "height", this.rect.height );

		this.items = this.tree.render( this.items, items, this.g );
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
		if( this.root && this.root.parentNode ) {
			this.root.parentNode.removeChild( this.root );
		}
		this.root = null;
		this.g = null;
		this.items = [];
	}
}

export function renderer() {
	return new SVGRenderer( tree, svgNs );
}

/**
 * Create an SVGElement and attach to parent.
 * @callback SVGCreator
 * @param {String} type - The type of element to create.
 * @param {SVGElement} parent - The parent element to append the new element to.
 * @returns {SVGElement} The created element
 */

/**
 * Update the element with content from item.
 * @callback SVGMaintainer
 * @param {SVGElement} el - The element to update
 * @param {Object} item - The object to use as input for the update
 */

/**
 * Detach element from its parent.
 * @callback SVGDestroyer
 * @param {SVGElement} el - Element to destroy.
 */

/**
 * Create, update and destroy nodes.
 * @callback TreeCreator
 * @param {Object[]} existing - The existing items in the tree.
 * @param {Object[]} active - The new items to create the tree from.
 * @param {SVGCreator} creator - Function used to create nodes.
 * @param {SVGMaintainer} maintainer - Function used to update nodes.
 * @param {SVGDestroyer} destroyer - Function used to destroy nodes.
 */
