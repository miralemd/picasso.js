function toPercentage(val) {
	return val * 100;
}

/**
 *
 * @param h - The hue
 * @param s - The saturation
 * @param l - The lightness
 * @returns {*[]} - r, g, b in set [0,255]
 */
function toRGB( h, s, l ) {
	let r, g, b;

	h = h / 360;

	if( s === 0 ){
		r = g = b = l;
	}
	else {
		let hue2rgb = ( p, q, t ) => {
			if ( t < 0 ) { t += 1; }
			if ( t > 1 ) { t -= 1; }
			if ( t < 1 / 6 ) { return p + ( q - p ) * 6 * t; }
			if ( t < 1 / 2 ) { return q; }
			if ( t < 2 / 3 ) { return p + ( q - p ) * (2 / 3 - t ) * 6; }
			return p;
		};

		var q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb( p, q, h + 1 / 3 );
		g = hue2rgb( p, q, h );
		b = hue2rgb( p, q, h - 1 / 3 );
	}

	r = Math.round( r * 255 );
	g = Math.round( g * 255 );
	b = Math.round( b * 255 );

	return `${r}, ${g}, ${b}`;
}

export default class HslaColor {
	constructor( h, s, l, a = 1) {
		this.h = h;
		this.s = s;
		this.l = l;
		this.a = a;
	}

	/**
	* Returns a hsl string representation of this color using "bi-hexcone" model for lightness
	* @return {string} In format hsl(0,0,0)
	*/
	toHSL() {
		return `hsl(${this.h}, ${toPercentage(this.s)}%, ${toPercentage(this.l)}%)`;
	}

	/**
	 * Returns a hsla string representation of this color using "bi-hexcone" model for lightness
	 * @return {string} In format hsla(0,0,0,0)
	 */
	toHSLA() {
		return this.toString();
	}

	/**
	 * Returns an rgb string representation of this color.
	 * @return {string} An rgb string representation of this color
	 */
	toRGB() {
		let rgb = toRGB( this.h, this.s, this.l );
		return `rgb(${rgb})`;
	}

	/**
	 * Returns an rgba string representation of this color.
	 * @return {string} An rgba string representation of this color.
	 */
	toRGBA() {
		let rgba = toRGB( this.h, this.s, this.l );
		return `rgba(${rgba}, ${this.a})`;
	}

	toString() {
		return `hsla(${this.h}, ${toPercentage(this.s)}%, ${toPercentage(this.l)}%, ${this.a})`;
	}
}


