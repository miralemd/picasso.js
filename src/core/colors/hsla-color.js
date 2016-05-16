function toPercentage ( val ) {
	return val * 100;
}

function componentToHex( c ) {
	let hex = c.toString( 16 );
	return hex.length === 1 ? "0" + hex : hex;
}

function hue2rgb( p, q, t ) {
	if ( t < 0 ) { t += 1; }
	if ( t > 1 ) { t -= 1; }
	if ( t < 1 / 6 ) { return p + ( q - p ) * 6 * t; }
	if ( t < 1 / 2 ) { return q; }
	if ( t < 2 / 3 ) { return p + ( q - p ) * ( 2 / 3 - t ) * 6; }
	return p;
}

/**
 * Converts HSL to RGB.
 * @param h - The hue
 * @param s - The saturation
 * @param l - The lightness
 * @returns {string} - In format 0, 0, 0
 */
function toRgb( h, s, l ) {
	let r, g, b;

	h = h / 360;

	if ( s === 0 ){
		r = g = b = l;
	}
	else {
		let q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
		let p = 2 * l - q;
		r = hue2rgb( p, q, h + 1 / 3 );
		g = hue2rgb( p, q, h );
		b = hue2rgb( p, q, h - 1 / 3 );
	}

	return {
		r: Math.round( r * 255 ),
		g: Math.round( g * 255 ),
		b: Math.round( b * 255 )
	};
}

function toByte( h, s, l ) {
	return {
		h: parseInt( h * 255 / 359 ) & 0xFF,
		s: parseInt( s * 255 ) & 0xFF,
		l: parseInt( l * 255 ) & 0xFF
	};
}

export default class HslaColor {
	constructor( h, s, l, a = 1 ) {
		this.h = h;
		this.s = s;
		this.l = l;
		this.a = a;
	}

	/**
	* Returns a hsl string representation of this color.
	* @returns {string} - In format hsl(0, 0%, 0%)
	*/
	toHSL() {
		return `hsl(${this.h}, ${toPercentage( this.s )}%, ${toPercentage( this.l )}%)`;
	}

	/**
	 * Returns a hsla string representation of this color.
	 * @return {string} - In format hsla(0, 0%, 0%, 0)
	 */
	toHSLA() {
		return this.toString();
	}

	/**
	 * Returns an rgb string representation of this color.
	 * @return {string} - In format rgb(0, 0, 0)
	 */
	toRGB() {
		let rgb = toRgb( this.h, this.s, this.l );
		return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
	}

	/**
	 * Returns an rgba string representation of this color.
	 * @return {string} - In format rgba(0, 0, 0, 0)
	 */
	toRGBA() {
		let rgb = toRgb( this.h, this.s, this.l );
		return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.a})`;
	}

	/**
	 * Returns a hex string representation of this color.
	 * @return {string} - In format #000000
	 */
	toHex() {
		let rgb = toRgb( this.h, this.s, this.l );
		return "#" + componentToHex( rgb.r ) + componentToHex( rgb.g ) + componentToHex( rgb.b );
	}

	/**
	 * Returns an number representation of the color
	 * @return {number} - Unsigned 24 bt integer in the range 0-16 777 216
	 */
	toNumber() {

		let hex = toByte( this.h, this.s, this.l );

		return ( hex.h << 16 ) + ( hex.s << 8 ) + hex.l;
	}

	/**
	 * Returns a string representation of this color.
	 * @returns {string} - In format hsla(0, 0%, 0%, 0)
	 */
	toString() {
		return `hsla(${this.h}, ${toPercentage( this.s )}%, ${toPercentage( this.l )}%, ${this.a})`;
	}

	/**
	 * Compares two colors.
	 * @param {HslaColor} c The color to compare with.
	 * @return {boolean} True if the hsl channels are the same, false otherwise
	 */
	isEqual( c ) {
		return ( ( this.h === c.h ) && ( this.s === c.s ) && ( this.l === c.l ) && ( this.a === c.a ) );
	}

	/**
	 * Calculates the perceived luminance of the color.
	 * @return {number} - A value in the range 0-1 where a low value is considered dark and vice versa.
	 */
	getLuminance() {
		let rgb = toRgb( this.h, this.s, this.l ),
			luminance = Math.sqrt( 0.299 * Math.pow( rgb.r, 2 ) + 0.587 * Math.pow( rgb.g, 2 ) + 0.114 * Math.pow( rgb.b, 2 ) );

		return luminance / 255;
	}

	/**
	 * Checks if this color is perceived as dark.
	 * @return {boolean} True if the luminance is below 125, false otherwise.
	 */
	isDark () {
		return this.getLuminance() < 0.49;
	}
}
