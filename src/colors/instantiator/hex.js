import RgbaColor from "../rgba-color";

const rHex = /^\s*#([A-Fa-f0-9]{2})([A-f0-A-Fa-f0-9]{2})([A-Fa-f0-9]{2})\s*$/i,
	rHexShort = /^\s*#([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])\s*$/i;

export default function hex( colStr ) {

	let [r, g, b] = (rHex.exec( colStr ) || rHexShort.exec( colStr ) || []).slice( 1 ).map( v => {
		return parseInt( v.length === 1 ? v + v : v, 16 );
	} );

	return new RgbaColor( r, g, b, 1 );
}

hex.test = ( colStr ) => typeof colStr === "string" && ( rHex.test( colStr ) || rHexShort.test( colStr ) );
