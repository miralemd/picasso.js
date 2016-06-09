import { createTree } from "../node-tree";
import { creator, maintainer, destroyer } from "./svg-nodes";

export default class TreeItemRenderer {
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
