function toHSL( r, g, b ) {
	r = r / 255;
	g = g / 255;
	b = b / 255;

	let max = Math.max( r, g, b );
	let min = Math.min( r, g, b );
	let h, s, l = ( max + min ) / 2;

	if( max === min ){
		h = s = 0;
	} else {
		let d = max - min;
		s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
		switch( max ){
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

	return `${Math.round( h * 360)}, ${Math.round( s * 100)}%, ${Math.round( l * 100)}%`;
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
		let componentToHex = ( c ) => {
			var hex = c.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		};
		return "#" + componentToHex( this.r ) + componentToHex( this.g ) + componentToHex( this.b );
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
	 * Returns a 32-bit uint representation of this color
	 * @return {number}
	 */
	toNumber() {
		var r = this.r & 0xFF;
		var g = this.g & 0xFF;
		var b = this.b & 0xFF;
		var a = this.a & 0xFF;

		var rgb = (r << 24) + (g << 16) + (b << 8) + (a);
		return rgb;
	}

    /**
     * Checks if this color is perceived as dark.
     * @return {boolean} True if the luminance is below 125, false otherwise.
     */
    isDark() {
		return this.getLuminance() < 125;
    }

    /**
	 * Calculates the perceived luminance of the color.
	 * @return {number} A value in the range 0-1 where a low value is considered dark and vice versa.
	 */
	getLuminance() {

		let luminance1 = Math.sqrt(0.299 * Math.pow(this.r, 2) + 0.587 * Math.pow(this.g, 2) + 0.114 * Math.pow(this.b, 2)); // Using Weighted Euclidean Distance in 3D RGB Space
		//let luminance2 = 0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b; // sRGB Luma

		return Math.round( ( luminance1 / 255 ) * 100 ) / 100;
	}

	/**
	 * Shifts the color towards a lighter or darker shade
	 * @param {number} value - A value in the range -100-100 to shift the color with along the HSL lightness.
	 * @return {string} The shifted color as hsla string.
	 */
	shiftLuminance() {

	}

	/**
     * Linearly interpolates each channel of two colors.
     * @param {rgb color} c The other color.
     * @param {number} t The interpolation value in the range (0-1).
     * @return {string} The blend as an rgb string.
     */
    blend( c, t ) {
		let
			r = this.r + ( c.r - this.r ) * t,
			g = this.g + ( c.g - this.g ) * t,
			b = this.b + ( c.b - this.b ) * t;

		return `rgb(${r}, ${g}, ${b})`;
    }

    getContrast ( c ) {
		var l1 = this.getLuminance() / 100,
			l2 = c.getLuminance() / 100;

		if ( l1 > l2 ) {
			return ( l1 + 0.05 ) / ( l2 + 0.05 );
		}
		else {
			return ( l2 + 0.05 ) / ( l1 + 0.05 );
		}
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
