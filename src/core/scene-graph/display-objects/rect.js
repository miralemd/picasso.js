import DisplayObject from "./display-object";
import GeoRect from "../../geometry/rect";

export default class Rect extends DisplayObject {
	constructor( x, y, width, height ) {
		super();
		this.set( x, y, width, height );
	}

	set ( x, y, width, height ) {
		GeoRect.prototype.set.call( this, x, y, width, height );
		this.invalidateBounds();
	}

	localBounds () {
		return GeoRect.prototype.bounds.call( this );
	}
}
