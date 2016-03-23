import hex from "./instantiator/hex";
import rgb from "./instantiator/rgb";
import hsl from "./instantiator/hsl";
import colorKeyWord from "./instantiator/color-keyword";
import colorObject from "./instantiator/color-object";
import {default as colourUtils} from "./utils";
import scale from "./color-scale";
import colorRegister from "./color-register";
import palettes from "./palettes";

export function color( ...a ) {
	return colorRegister( ...a );
}

/**
 * Extend the color instance with new methods
 * @param  {string}	name 	Name of the property
 * @param  {object} obj  	Object to extend with
 */
color.extend = ( name, obj ) => {
	if ( color.hasOwnProperty( name ) ) {
		// TODO Do something here
	}
	color[name] = obj;
};

colorRegister.register( hex.test, hex );
colorRegister.register( rgb.test, rgb );
colorRegister.register( hsl.test, hsl );
colorRegister.register( colorKeyWord.test, colorKeyWord );
colorRegister.register( colorObject.test, colorObject );

color.extend( "scale", scale );
color.extend( "palettes", palettes );
color.extend( "utils", colourUtils );
