let rRgb = /^\s*rgb\(\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*\)\s*$/i,
	rRgbPer = /^\s*rgb\(\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*\)\s*$/i,
	rRgba = /^\s*rgba\(\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d{0,1}\.{0,1}\d+?)\s*\)\s*$/i,
	rRgbaPer = /^\s*rgba\(\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{0,1}\.{0,1}\d+?)\s*\)\s*$/i;

export class Rgb {
	constructor( s ) {

		let ary = (rRgb.exec( s ) || rRgbPer.exec( s ) || rRgba.exec( s ) || rRgbaPer.exec( s ) || []);

		let [r, g, b, a] = ary.slice( 1, 5 ).map( val => {

			if ( ary.indexOf( val ) === 4 ) {
				val = parseFloat( val );
				val = val > 1 ? 1 : val;
				val = val < 0 ? 0 : val;
				return val;
			}

			if ( val.includes( "%" ) ) {
				val = parseInt( val.replace("%", "") );
				val = val > 100 ? 100 : val;
				val = val < 0 ? 0 : val;
				val = Math.round( 255 * ( val / 100 ) );
			} else {
				val = parseInt( val );
				val = val > 255 ? 255 : val;
				val = val < 0 ? 0 : val;
			}

			return val;
		} );

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a === undefined ? 1 : a;
	}
	toString() {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
	}
}

export default function rgb( ...s ) {
	return new Rgb( ...s );
}

rgb.test = (...a) => rRgb.test( a[0] ) || rRgbPer.test( a[0] ) || rRgba.test( a[0] ) || rRgbaPer.test( a[0] );
