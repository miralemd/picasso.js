import DisplayObject from "./display-object";
import GeoCircle from "../../geometry/circle";

export default class Circle extends DisplayObject {
	constructor( ...s ) {
		super();
		this.set( ...s );
	}

	set ( { cx, cy, r, fill } ) {
		GeoCircle.prototype.set.call( this, cx, cy, r );
		if ( typeof fill !== "undefined" ) {
			this.fill = fill;
		}
		this.invalidateBounds();
	}

	localBounds () {
		return GeoCircle.prototype.bounds.call( this );
	}
}

export function create( ...s ) {
	return new Circle( ...s );
}
