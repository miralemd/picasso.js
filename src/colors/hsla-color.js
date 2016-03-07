export default class HslaColor {
	constructor( ...hsla ) {
		this.h = hsla[0];
		this.s = hsla[1];
		this.l = hsla[2];
		this.a = hsla[3];
	}

	/**
	* Returns a hsl string representation of this color using "bi-hexcone" model for lightness
	* @param {boolean} luma - Whether to use luma calculation
	* @return {string} In format hsl(0,0,0)
	*/
	toHSL( luma ) {
		return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
	}

	/**
	 * Returns a hsla string representation of this color using "bi-hexcone" model for lightness
	 * @param {boolean} luma - Whether to use luma calculation
	 * @return {string} In format hsla(0,0,0,0)
	 */
	toHSLA( luma ) {
		return this.toString();
	}

	/**
	 * Returns an rgb string representation of this color.
	 * @return {string} An rgb string representation of this color
	 */
	toRGB() {

	}

	/**
	 * Returns an rgba string representation of this color.
	 * @return {string} An rgba string representation of this color.
	 */
	toRGBA() {

	}

	toString() {
		return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
	}
}
