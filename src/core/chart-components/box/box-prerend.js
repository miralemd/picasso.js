export default class BoxPrerend {
	constructor( ...items ) {
		this.storage = [];
		this.flipXY = false;

		this.width = 0;
		this.height = 0;

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

	coordinateToValue( key, coordinate ) {
		if ( Number.isFinite( coordinate ) ) {

			let firstChar = key.substring( 0, 1 );

			if ( firstChar === "x" || key === "width" ) {
				return coordinate * this.width;
			} else if ( firstChar === "y" || key === "height" ) {
				return coordinate * this.height;
			} else {
				return coordinate;
			}
		}

		return coordinate;
	}

	push( ...items ) {
		this.storage.push( ...items );
	}

	output() {
		let items = this.storage.map( item => {
			let newItem = {};

			Object.keys( item ).forEach( key => {
				let nkey = this.flipXY ? this.oppositeKey( key ) : key;
				let nval = this.coordinateToValue( nkey, item[key] );
				newItem[ nkey ] = nval;
			} );

			return newItem;
		} );

		return items;
	}
}

export function boxPrerend( ...items ) {
	return new BoxPrerend( ...items );
}
