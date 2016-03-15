import hex from "./instantiator/hex";
import rgb from "./instantiator/rgb";
import hsl from "./instantiator/hsl";
import colorKeyWord from "./instantiator/color-keyword";
import colorObject from "./instantiator/color-object";
import ColourUtils from "./utils";
import scale from "./color-scale";

let rangeCal = ( min, max, colors ) => {
	let from = [min];
	let incrementor = ( max - min ) / ( colors.length - 1 );

	for (var i = 0; i < colors.length - 2; i++) {
		from.push( from[i] + incrementor );
	}

	from.push( max );

	return from;
};

let creators = [];
export default function color( ...a ) {

	for ( let i = 0; i < creators.length; i++ ) {
		if ( creators[i].test( ...a ) ) {
			return creators[i].fn( ...a );
		}
	}
}

/**
 * Register a color instantiator
 * @param  {Function} test [description]
 * @param  {Function} fn   [description]
 * @return {object}        [description]
 * @example
 * let fn = () => {
 * 	return {
 * 		r: Math.floor(Math.random()*255),
 * 		g: Math.floor(Math.random()*255),
 * 		b: Math.floor(Math.random()*255)
 * 		};
 * };
 *
 * let fnTest = c => c === "surprise";
 * color.register( fnTest, fn )
 *
 * let someColor = color("surprise");
 */
color.register = ( test, fn ) => {
	creators.push( {test, fn} );
};

color.register( hex.test, hex );
color.register( rgb.test, rgb );
color.register( hsl.test, hsl );
color.register( colorKeyWord.test, colorKeyWord );
color.register( colorObject.test, colorObject );

color.scale = scale;
color.scale.color = color;

color.palettes = {
	scientific: (min, max) => {
		let colorPalette = ["#3d52a1", "#3a89c9", "#77b7e5", "#b4ddf7", "#e6f5fe", "#ffe3aa", "#f9bd7e", "#ed875e", "#d24d3e", "#ae1c3e"].map((c) => {
			return color(c);
		});

		let from = rangeCal( min, max, colorPalette );

		return color.scale( colorPalette, from );
	},

	multiHue1: ( min, max ) => {
		let colorPalette = ["#fee391", "#fec44f", "#fb9a29", "#ec7014", "#cc4c02", "#993404", "#662506"].map( ( c ) => {
			return color(c);
		});

		let from = rangeCal( min, max, colorPalette );

		return color.scale( colorPalette, from );
	}
};

color.utils = new ColourUtils();
