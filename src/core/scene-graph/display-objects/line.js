import DisplayObject from "./display-object";
import GeoLine from "../../geometry/line";

export default class Line extends DisplayObject {
	constructor( ...s ) {
		super();
		this.set( ...s );
	}

	set ( { x1, y1, x2, y2, strokeWidth, stroke } ) {
		super.set( { strokeWidth, stroke } );
		GeoLine.prototype.set.call( this, x1, y1, x2, y2 );
	}
}

export function create( ...s ) {
	return new Line( ...s );
}
