import RgbaColor from "./rgba-color";

let rHex = /^\s*#([A-Fa-f0-9]{2})([A-f0-A-Fa-f0-9]{2})([A-Fa-f0-9]{2})\s*$/i,
	rHexShort = /^\s*#([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])\s*$/i;

export default function hex( ...s ) {

	let [r, g, b] = (rHex.exec( s[0] ) || rHexShort.exec( s[0] ) || []).slice( 1 ).map( v => {
		return parseInt( v.length === 1 ? v + v : v, 16 );
	} );

	return new RgbaColor( r, g, b, 1 );
}

hex.test = (...a) => typeof a[0] === "string" && ( rHex.test( a[0] ) || rHexShort.test( a[0] ) );
