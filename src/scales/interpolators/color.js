import {default as color} from "../../colors/color";

export default {
	/**
	 * Interpolate two colors
	 * @param  {object} from The color to interpolate from
	 * @param  {object} to   The color to interpolate to
	 * @param  {Number} t    A number between [0-1]
	 * @return {object}      The interpolated color
	 */
	interpolate: function( from, to, t ) {
		return color.interpolate(from, to, t);
	}
};
