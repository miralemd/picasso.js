import DisplayObject from "./display-object";
import GeoRect from "../../geometry/rect";

export default class Rect extends DisplayObject {
	constructor( ...s ) {
		super();
		this.set( ...s );
	}

	set ( { x, y, width, height, fill } ) {
		GeoRect.prototype.set.call( this, x, y, width, height );
		if ( typeof fill !== "undefined" ) {
			this.fill = fill;
		}
	}
}

export function create( ...s ) {
	return new Rect( ...s );
}
