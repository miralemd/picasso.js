let rHex = /^#([A-f0-9]{2})([A-f0-9]{2})([A-f0-9]{2})$/i,
	rHexShort = /^#([A-f0-9])([A-f0-9])([A-f0-9])$/i;

export class Rgb {
	constructor( s ) {
		let [r, g, b] = (rHex.exec( s ) || rHexShort.exec( s ) || []).slice( 1 ).map( v => {
			return parseInt( v.length === 1 ? v + v : v, 16 );
		} );

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = 1;
	}
	toString() {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
	}
}

export default function rgb( ...s ) {
	return new Rgb( ...s );
}

rgb.test = (...a) => rHex.test( a[0] ) || rHexShort.test( a[0] );
