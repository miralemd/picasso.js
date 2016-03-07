function toHSL( r, g, b ) {
	r = r / 255;
	g = g / 255;
	b = b / 255;

	let max = Math.max( r, g, b );
	let min = Math.min( r, g, b );
	let h, s, l = ( max + min ) / 2;

	if( max === min ){
		h = s = 0;
	}else{
		let d = max - min;
		s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
		switch(max){
			case r: h = ( g - b ) / d + ( g < b ? 6 : 0 ); break;
			case g: h = ( b - r ) / d + 2; break;
			case b: h = ( r - g ) / d + 4; break;
		}
		h /= 6;
	}

	return `${Math.round( h * 360)}, ${Math.round( s * 100)}, ${Math.round( l * 100)}`;
}

export default class RgbaColor {
    constructor( r, g, b, a = 1 ) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
	 * Returns an rgb string representation of this color.
	 * @return {string} An rgb string representation of this color
	 */
	toRGB() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
	}

	/**
	 * Returns an rgba string representation of this color.
	 * @return {string} An rgba string representation of this color.
	 */
	toRGBA() {
        return this.toString();
	}

    /**
	 * Returns a hex string representation of this color.
	 * @return {string}
	 */
	toHex() {

	}

	/**
	 * Returns a hsla string representation of this color using "bi-hexcone" model for lightness
	 * @return {string} In format hsl(0,0,0)
	 */
	toHSL() {
		let value = toHSL( this.r, this.g, this.b);
		return `hsl(${value})`;
	}

	/**
	 * Returns a hsla string representation of this color
	 * @return {string} In format hsla(0,0,0,0)
	 */
	toHSLA() {
		let value = toHSL( this.r, this.g, this.b);
		return `hsla(${value}, ${this.a})`;
	}

	/**
	 * Returns a uint representation of this color
	 * @return {number}
	 */
	toNumber() {

	}

    /**
     * Checks if this color is perceived as dark.
     * @return {string} True if the luminance is below 160, false otherwise.
     */
    isDark() {

    }

    /**
     * Calculates the perceived luminance of the color.
     * @return {number} A value in the range 0-255 where a low value is considered dark and vice versa.
     */
    getLuminance() {

    }

    /**
     * Linearly interpolates each channel of two colors.
     * @param {Color} c2 The other color.
     * @param {number} t The interpolation value in the range (0-1).
     * @return {string} The blend as an rgb string.
     */
    blend( ) {

    }

    /**
     * Compares two colors.
     * @param {Color} c The color to compare with.
     * @return {boolean} True if the rgb channels are the same, false otherwise
     */
    isEqual() {

    }

    toString() {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
	}
}
