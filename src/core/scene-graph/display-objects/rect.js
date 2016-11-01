import DisplayObject from "./display-object";
import GeoRect from "../../geometry/rect";

export default class Rect extends DisplayObject {
	constructor( ...s ) {
		super();
		this.set( ...s );
	}

	set ( { x, y, width, height, fill, stroke, strokeWidth, opacity, transform } ) {
		super.set( { fill, stroke, strokeWidth, opacity, transform } );
		GeoRect.prototype.set.call( this, x, y, width, height );
	}
}

export function create( ...s ) {
	return new Rect( ...s );
}
