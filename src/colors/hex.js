let rHex = /^\s*#([A-Fa-f0-9]{2})([A-f0-A-Fa-f0-9]{2})([A-Fa-f0-9]{2})\s*$/i,
	rHexShort = /^\s*#([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])\s*$/i;

export class Hex {
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

export default function hex( ...s ) {
	return new Hex( ...s );
}

hex.test = (...a) => rHex.test( a[0] ) || rHexShort.test( a[0] );
