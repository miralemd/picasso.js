import Node from "../node";

export default class DisplayObject extends Node {
	constructor ( ) {
		super();
		this._stage = null;
	}

	set ( { fill, stroke, strokeWidth, fontFamily, fontSize, baseline } ) {
		if ( typeof fill !== "undefined" ) {
			this.fill = fill;
		}
		if ( typeof stroke !== "undefined" ) {
			this.stroke = stroke;
		}
		if ( typeof strokeWidth !== "undefined" ) {
			this["stroke-width"] = strokeWidth;
		}
		if ( typeof fontFamily !== "undefined" ) {
			this["font-family"] = fontFamily;
		}
		if ( typeof fontSize !== "undefined" ) {
			this["font-size"] = fontSize;
		}
		if ( typeof baseline !== "undefined" ) {
			this.baseline = baseline;
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
