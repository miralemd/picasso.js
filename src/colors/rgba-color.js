export default class RgbaColor {
    constructor( ...rgba ) {
        this.r = rgba[0];
        this.g = rgba[1];
        this.b = rgba[2];
        this.a = rgba[3];
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
	* Returns a hsl string representation of this color using "bi-hexcone" model for lightness
	* @param {boolean} luma - Whether to use luma calculation
	* @return {string} In format hsl(0,0,0)
	*/
	toHSL( luma ) {

	}

    /**
	 * Returns a hsla string representation of this color using "bi-hexcone" model for lightness
	 * @param {boolean} luma - Whether to use luma calculation
	 * @return {string} In format hsla(0,0,0,0)
	 */
	toHSLA( luma ) {

	}

	/**
	 * Return the color components in hsv space using "hexcone" model for value (lightness)
	 * @param {Color|string} c
	 * @returns {object} The color components in hsv space {h:0-360, s:0-100, v:0-100}
	 */
	toHSV() {

	}

	/**
	 * Return the color components in hsv space using "hexcone" model for value (lightness)
	 * @param {Color|string} c
	 * @returns {object} The color components in hsv space {h:0-360, s:0-100, v:0-100}
	 */
	toHSVComponents() {

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
    blend() {

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
