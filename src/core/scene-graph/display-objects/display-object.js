import Node from "../node";

export default class DisplayObject extends Node {
	constructor ( ) {
		super();
		this._stage = null;
	}

	set ( { fill, stroke } ) {
		if ( typeof fill !== "undefined" ) {
			this.fill = fill;
		}
		if ( typeof stroke !== "undefined" ) {
			this.stroke = stroke;
		}
	}

	/**
	 * Returns the value of attribute a.
	 * @param a
	 * @returns {*} The value of attribute a.
	 */
	attr( a ) {
		return this[a];
	}

	get stage() {
		if ( this._parent && !this._stage ) { // lazy evaluation
			this._stage = this._parent.stage;
		}
		else if ( !this._parent && this._stage !== this ) {
			this._stage = null;
		}
		return this._stage;
	}
}
