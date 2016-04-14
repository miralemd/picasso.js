import RgbaColor from "../rgba-color";

const rRgb = /^\s*rgb\(\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*\)\s*$/i,
	rRgbPer = /^\s*rgb\(\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*\)\s*$/i,
	rRgba = /^\s*rgba\(\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d{1,3})\s*,\s*(-?\d+\.?\d*?)\s*\)\s*$/i,
	rRgbaPer = /^\s*rgba\(\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*,\s*(-?\d{1,3}%{1})\s*,\s*(-?\d+\.?\d*?)\s*\)\s*$/i;

export default function rgb( colStr ) {

	let ary = (rRgb.exec( colStr ) || rRgba.exec( colStr ) || rRgbPer.exec( colStr ) || rRgbaPer.exec( colStr ) || []);

	let [r, g, b, a] = ary.slice( 1, 5 ).map( val => {

		// Last value is the Alpha which may or may not be present
		if ( ary.indexOf( val ) === 4 ) {
			val = parseFloat( val );
			val = val > 1 ? 1 : val;
			val = val < 0 ? 0 : val;
			return val;
		}

		if ( val.indexOf( "%" ) >= 0 ) {
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

	return new RgbaColor( r, g, b, a );
}

rgb.test = ( colStr ) => typeof colStr === "string" && ( rRgb.test( colStr ) || rRgba.test( colStr ) || rRgbPer.test( colStr ) || rRgbaPer.test( colStr ) );
