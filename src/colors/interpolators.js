import { default as numeric } from "../scales/interpolators/numeric";
import colorObject from "./instantiator/color-object";
import colorRegister from "./color-register";

export default {
	/**
	* Interpolate two colors
	* @param  {object} from The color to interpolate from
	* @param  {object} to   The color to interpolate to
	* @param  {Number} t	A number between [0-1]
	* @return {object}	  The interpolated color
	*/
	interpolate: ( from, to, t ) => {
		let fromC = colorRegister( from ),
			toC = colorRegister( to ),
			colorObj = {};

		if ( typeof fromC === "object" && typeof toC === "object" ) {

			let targetType = colorObject.getColorType( toC );

			if ( targetType === "rgb" ) {
				if ( colorObject.getColorType( fromC ) === "hsl" ) {
					fromC = colorRegister( fromC.toRGB() );
				}

				colorObj.r = Math.round( numeric.interpolate( fromC.r, toC.r, t ) );
				colorObj.g = Math.round( numeric.interpolate( fromC.g, toC.g, t ) );
				colorObj.b = Math.round( numeric.interpolate( fromC.b, toC.b, t ) );

			} else if ( targetType === "hsl" ) {
				if ( colorObject.getColorType( fromC ) === "rgb" ) {
					fromC = colorRegister( fromC.toHSL() );
				}

				colorObj.h = Math.round( numeric.interpolate( fromC.h, toC.h, t ) );
				colorObj.s = numeric.interpolate( fromC.s, toC.s, t );
				colorObj.l = numeric.interpolate( fromC.l, toC.l, t );
			}
		}

		return colorRegister( colorObj );
	}
};
