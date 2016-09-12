export default class BoxPrerend extends Array {
	constructor( ...items ) {
		super();
		this.flipXY = false;
		this.push( ...items );
	}

	oppositeKey( value ) {
		let firstChar = value.substring( 0, 1 );
		let rest = value.substring( 1 );

		if ( firstChar === "x" ) {
			return "y" + rest;
		} else if ( firstChar === "y" ) {
			return "x" + rest;
		} else if ( value === "width" ) {
			return "height";
		} else if ( value === "height" ) {
			return "width";
		}

		return value;
	}

	push( ...items ) {
		if ( this.flipXY ) {
			items = items.map( item => {
				let newItem = {};
				Object.keys( item ).forEach( key => {
					newItem[ this.oppositeKey( key ) ] = item[key];
				} );
				return newItem;
			} );
		}
		super.push( ...items );
	}

	get width() {
		return this.flipXY ? this._height : this._width;
	}

	set width( value ) {
		this[ this.flipXY ? "_height" : "_width" ] = value;
	}

	get height() {
		return this.flipXY ? this._width : this._height;
	}

	set height( value ) {
		this[ this.flipXY ? "_width" : "_height" ] = value;
	}
}

export function boxPrerend( ...items ) {
	return new BoxPrerend( ...items );
}
