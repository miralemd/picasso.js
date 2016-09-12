import DisplayObject from "./display-object";
import GeoCircle from "../../geometry/circle";

export default class Circle extends DisplayObject {
	constructor( ...s ) {
		super();
		this.set( ...s );
	}

	set ( { cx, cy, r, fill, stroke } ) {
		super.set( { fill, stroke } );
		GeoCircle.prototype.set.call( this, cx, cy, r );
	}
}

export function create( ...s ) {
	return new Circle( ...s );
}
