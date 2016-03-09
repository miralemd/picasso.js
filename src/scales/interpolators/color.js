import {default as color} from "../../colors/color";
import {default as numeric} from "./numeric";


export default {
	color,
	numeric,
	/**
	 * Interpolate two colors
	 * @param  {object} from The color to interpolate from
	 * @param  {object} to   The color to interpolate to
	 * @param  {Number} t    A number between [0-1]
	 * @return {object}      The interpolated color
	 */
	interpolate: function( from, to, t ) {
		let c1 = typeof from === "string" ? this.color( from ) : from,
			c2 = typeof to === "string" ? this.color( to ) : to;
		return this.color(`rgba(${Math.round(this.numeric.interpolate( c1.r, c2.r, t ))}, ${Math.round(this.numeric.interpolate( c1.g, c2.g, t ))},	${Math.round(this.numeric.interpolate( c1.b, c2.b, t ))}, ${Math.round(this.numeric.interpolate( c1.a, c2.a, t ))})`
		);
	}
};
