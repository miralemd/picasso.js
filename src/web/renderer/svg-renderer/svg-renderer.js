import { createTree } from "../node-tree";
import { svgNs, creator, maintainer, destroyer } from "./svg-nodes";

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

export default class SVGRenderer {
	/**
	 * Constructor
	 * @param  {SVGCreator} creator - Function used to create nodes.
	 * @param  {SVGMaintainer} maintainer - Function used to update nodes.
	 * @param  {SVGDestroyer} destroyer - Function used to destroy nodes.
	 */
	constructor( creator, maintainer, destroyer ) {
		this.ns = svgNs;
		this.creator = creator;
		this.maintainer = maintainer;
		this.destroyer = destroyer;

		this.items = [];
		this.rect = {x: 0, y: 0, width: 0, height: 0};
	}

	/**
	 * Append the svg renderer to an element.
	 * @param  {HTMLElement} element - The element to append the svg renderer to.
	 */
	appendTo( element ) {
		this.root = element.ownerDocument.createElementNS( ns, "svg" );
		this.root.setAttribute( "xmlns", ns );
		this.g = element.ownerDocument.createElementNS( ns, "g" );
		this.root.appendChild( this.g );

		element.appendChild( this.root );
	}

	/**
	 * Render items.
	 * @param  {Object[]} items - Items to render.
	 * @example
	 * renderer.render([
	 * 	{type: "circle", cx: 50, cy: 20, r: 13},
	 * 	{type: "rect", width: 20, height: 50, fill: "red"}
	 * ]);
	 */
	render( items ) {
		this.root.setAttribute( "width", this.rect.width );
		this.root.setAttribute( "height", this.rect.height );

		this.items = createTree( this.items, items, this.g, this.creator, this.maintainer, this.destroyer );
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
	}
}
