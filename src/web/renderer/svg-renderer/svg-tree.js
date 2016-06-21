import { createTree } from "../node-tree";
import { creator, maintainer, destroyer } from "./svg-nodes";

/** @module web/renderer/svg-renderer */

export default class TreeItemRenderer {
	/**
	 * Constructor
	 * @param  {TreeCreator} treeCreator - Function used to create the DOM tree..
	 * @param  {SVGCreator} nodeCreator - Function used to create nodes.
	 * @param  {SVGMaintainer} nodeMaintainer - Function used to update nodes.
	 * @param  {SVGDestroyer} nodeDestroyer - Function used to destroy nodes.
	 */
	constructor( treeCreator, nodeCreator, nodeMaintainer, nodeDestroyer ) {
		this.create = treeCreator;
		this.nodeCreator = nodeCreator;
		this.nodeMaintainer = nodeMaintainer;
		this.nodeDestroyer = nodeDestroyer;
	}

	render( oldItems, newItems, root ) {
		return this.create( oldItems, newItems, root, this.nodeCreator, this.nodeMaintainer, this.nodeDestroyer );
	}
}

export function tree() {
	return new TreeItemRenderer( createTree, creator, maintainer, destroyer );
}

/**
 * Create an SVGElement and attach to parent.
 * @callback SVGCreator
 * @param {String} type - The type of element to create.
 * @param {SVGElement} parent - The parent element to append the new element to.
 * @return {SVGElement} The created element
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
