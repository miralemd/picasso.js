function componentToHex( c ) {
	let hex = c.toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}


/**
 * Converts RGB to HSL.
 * @param r - Red
 * @param g - Green
 * @param b - Blue
 * @returns {string} - In format 0, 0%, 0%
 */
function toHSL( r, g, b ) {
	r = r / 255;
	g = g / 255;
	b = b / 255;

	let max = Math.max( r, g, b );
	let min = Math.min( r, g, b );
	let h, s, l = ( max + min ) / 2;

	if ( max === min ){
		h = s = 0;
	} else {
		let d = max - min;
		s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
		switch ( max ) {
			case r:
				h = ( g - b ) / d + ( g < b ? 6 : 0 );
				break;
			case g:
				h = ( b - r ) / d + 2;
				break;
			case b:
				h = ( r - g ) / d + 4;
				break;
		}
		h /= 6;
	}

	return `${Math.round( h * 360 )}, ${Math.round( s * 100 )}%, ${Math.round( l * 100 )}%`;
}

export default class RgbaColor {
    constructor( r, g, b, a = 1 ) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

	/**
	 * Returns a hsl string representation of this color.
	 * @return {string} = In format hsl(0,0,0)
	 */
	toHSL() {
		let value = toHSL( this.r, this.g, this.b);
		return `hsl(${value})`;
	}

	/**
	 * Returns a hsla string representation of this color
	 * @return {string} - In format hsla(0,0,0,0)
	 */
	toHSLA() {
		let value = toHSL( this.r, this.g, this.b);
		return `hsla(${value}, ${this.a})`;
	}

	/**
	 * Returns an rgb string representation of this color.
	 * @return {string} - In format rgb(0, 0, 0)
*/
	toRGB() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
	}

	/**
	 * Returns an rgba string representation of this color.
	 * @return {string} - In format rgb(0, 0, 0, 0)
	 */
	toRGBA() {
        return this.toString();
	}

    /**
	 * Returns a hex string representation of this color.
	 * @return {string} - In format #000000
	 */
	toHex() {
		return "#" + componentToHex( this.r ) + componentToHex( this.g ) + componentToHex( this.b );
	}

	/**
	 * Returns an number representation of the color
	 * @return {number} Unsigned integer in the range 0-16 777 216
	 */
	toNumber() {
		let r = this.r & 0xFF,
			g = this.g & 0xFF,
			b = this.b & 0xFF,

			rgb = (r << 16) + (g << 8) + (b);
		return rgb;
	}

	/**
	 * Compares two colors.
	 * @param {RgbaColor} c The color to compare with.
	 * @return {boolean} True if the rgb channels are the same, false otherwise
	 */
	isEqual( c ) {
		return ( ( this.r === c.r ) && ( this.g === c.g ) && ( this.b === c.b ) && ( this.a === c.a ));
	}

	/**
	 * convert rgba color to string
	 * @returns {string}
	 */
	toString() {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
	}

	/**
	 * Calculates the perceived luminance of the color.
	 * @return {number} - A value in the range 0-1 where a low value is considered dark and vice versa.
	 */
	getLuminance() {
		let luminance = Math.sqrt( 0.299 * Math.pow( this.r, 2 ) + 0.587 * Math.pow( this.g, 2 ) + 0.114 * Math.pow( this.b, 2 ) ); // Using Weighted Euclidean Distance in 3D RGB Space
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
