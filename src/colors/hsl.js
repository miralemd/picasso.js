import HslaColor from "./hsla-color";

let rHsl = /^\s*hsl\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*%{1})\s*,\s*(-?\d+\.?\d*%{1})\s*\)$/i,
	rHsla = /^\s*hsla\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*%{1})\s*,\s*(-?\d+\.?\d*%{1})\s*,\s*(-?\d+\.?\d*)\s*\)\s*$/i;

export default function hsl( ...str ) {

	let match = ( rHsl.exec( str[0] ) || rHsla.exec( str[0] ) || [] );

	let [h, s, l, a] = match.slice( 1 ).map( v => {

		let returnVal = parseFloat( v );

		switch ( match.indexOf( v ) ) {
			case 1:
				returnVal = (((returnVal % 360) + 360) % 360);
				return Math.round(returnVal);
			case 2:
			case 3:
				returnVal = returnVal > 100 ? 100 : returnVal;
				returnVal = returnVal < 0 ? 0 : returnVal;
				return Math.round( returnVal ) / 100;
			default:
				returnVal = returnVal > 1 ? 1 : returnVal;
				returnVal = returnVal < 0 ? 0 : returnVal;
				return returnVal;
		}
	} );

	return new HslaColor( h, s, l, a );
}

hsl.test = (...a) => typeof a[0] === "string" && ( rHsl.test( a[0] ) || rHsla.test( a[0] ) );
