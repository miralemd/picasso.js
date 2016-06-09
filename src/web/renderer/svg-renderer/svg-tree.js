import { createTree } from "../node-tree";
import { svgNs, creator, maintainer, destroyer } from "./svg-nodes";

export default class TreeItemRenderer {
	constructor( createTree, creator, maintainer, destroyer ) {
		this.create = createTree;
		this.nodeCreator = creator;
		this.nodeMaintainer = maintainer;
		this.nodeDestroyer = destroyer;
	}

	render( oldItems, newItems, root ) {
		return this.create( oldItems, newItems, root, this.nodeCreator, this.nodeMaintainer, this.nodeDestroyer );
	}
}

export function tree() {
	return new TreeItemRenderer( createTree, creator, maintainer, destroyer );
}
