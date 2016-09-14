import DisplayObject from "./display-object";
import NodeContainer from "../node-container";

const NC = NodeContainer.prototype;

export default class Container extends DisplayObject {
	addChild ( c ) {
		return NC.addChild.call( this, c );
	}

	addChildren ( children ) {
		return NC.addChildren.call( this, children );
	}

	removeChild ( c ) {
		c._stage = null;
		let desc = c.descendants,
			num = desc ? desc.length : 0,
			i;
		// remove reference to stage from all descendants
		for ( i = 0; i < num; i++ ) {
			desc[i]._stage = null;
		}

		NC.removeChild.call( this, c );
		return this;
	}

	removeChildren ( children ) {
		return NC.removeChildren.call( this, children );
	}
}

export function create() {
	return new Container();
}
