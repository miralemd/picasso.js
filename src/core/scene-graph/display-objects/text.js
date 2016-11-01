import DisplayObject from "./display-object";

export default class Text extends DisplayObject {
	constructor( ...s ) {
		super();
		this.set( ...s );
	}

	set ( { x, y, text, anchor, fontFamily, fontSize, fill, baseline, maxWidth, opacity, transform } ) {
		super.set( { anchor, fontFamily, fontSize, fill, baseline, maxWidth, opacity, transform } );
		this.x = x;
		this.y = y;
		this.text = text;
	}
}

export function create( ...s ) {
	return new Text( ...s );
}
