import RgbaColor from "./rgba-color";

let rRgb = /^\s*rgb\(\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*\)\s*$/i,
	rRgbPer = /^\s*rgb\(\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*\)\s*$/i,
	rRgba = /^\s*rgba\(\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d+\.?\d*?)\s*\)\s*$/i,
	rRgbaPer = /^\s*rgba\(\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*,\s*(-?\d+\.?\d*?)\s*\)\s*$/i;

export default function rgb( ...s ) {

	let ary = (rRgb.exec( s[0] ) || rRgbPer.exec( s[0] ) || rRgba.exec( s[0] ) || rRgbaPer.exec( s[0] ) || []);

	let [r, g, b, a] = ary.slice( 1, 5 ).map( val => {

		// Last value is the Alpha which may or may not be present
		if ( ary.indexOf( val ) === 4 ) {
			val = parseFloat( val );
			val = val > 1 ? 1 : val;
			val = val < 0 ? 0 : val;
			return val;
		}

		if ( val.includes( "%" ) ) {
			val = parseFloat( val );
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

	return new RgbaColor( r, g, b, a === undefined ? 1 : a );
}

rgb.test = (...a) => rRgb.test( a[0] ) || rRgbPer.test( a[0] ) || rRgba.test( a[0] ) || rRgbaPer.test( a[0] );
