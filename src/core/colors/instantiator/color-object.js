/**
 * @module core/colors/instantiator/color-object
 */

import RgbaColor from "../rgba-color";
import HslaColor from "../hsla-color";

/**
 * Instanciate a new color object
 * @param { Object } colorObj Color object
 * @property { Number } colorObj.h Required for an HSL object
 * @property { Number } colorObj.s Required for an HSL object
 * @property { Number } colorObj.l Required for an HSL object
 * @property { Number } colorObj.r Required for an RGB object
 * @property { Number } colorObj.g Required for an RGB object
 * @property { Number } colorObj.b Required for an RGB object
 * @return { HslaColor | RgbaColor } Color instance, the type returned depends on the color input
 * @example
 * colorObject( { r:255, g: 123, b: 123 } );
 */
export default function colorObject( colorObj ) {
	let colorType = colorObject.getColorType( colorObj );

	switch ( colorType ) {
		case "rgb":
			return new RgbaColor( colorObj.r, colorObj.g, colorObj.b, colorObj.a );
		case "hsl":
			return new HslaColor( colorObj.h, colorObj.s, colorObj.l, colorObj.a );
		default:
			return undefined;
	}
}

/**
 * Test if the object is a color instance
 * @function test
 * @param  { Object } obj Color object
 * @return { Boolean } TRUE if obj is an instance of RgbaColor or HslaColor
 * @example
 * colorObject.test( { r:255, g: 123, b: 123 } );
 */
colorObject.test = ( obj ) => {
	if ( obj === null || obj === undefined || typeof obj !== "object" ) {
		return false;
	} else {
    // Doesnt really work out well if any of the proparties have invalid values
		return colorObject.getColorType( obj ) !== undefined;
	}
};


/**
 * Get the color type from a color object
 * @function getColorType
 * @param  { Object } obj Color object
 * @return { String } rgb or hsl denpeding on the color type, undefined if no match is found
 * @example
 * colorObject.getColorType( { r:255, g: 123, b: 123 } )
 */
colorObject.getColorType = ( obj ) => {
	if ( typeof obj === "object" && obj.hasOwnProperty( "r" ) && obj.hasOwnProperty( "g" ) && obj.hasOwnProperty( "b" ) ) {
		return "rgb";
	} else if ( typeof obj === "object" && obj.hasOwnProperty( "h" ) && obj.hasOwnProperty( "s" ) && obj.hasOwnProperty( "l" ) ) {
		return "hsl";
	}
	return undefined;
};
