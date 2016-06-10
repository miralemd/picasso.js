export default class Point {
	constructor( obj, options ) {
		this.element = options.element;
	}
}

export function point( obj, options ) {
	return new Point( obj, options );
}
