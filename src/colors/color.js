import hex from "./hex";
import rgb from "./rgb";
import hsl from "./hsl";
import colorKeyWord from "./color-keyword";
import colorObject from "./color-object";
import {default as numeric} from "../scales/interpolators/numeric";

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

/**
 * Interpolate two colors
 * @param  {object} from The color to interpolate from
 * @param  {object} to   The color to interpolate to
 * @param  {Number} t    A number between [0-1]
 * @return {object}      The interpolated color
 */
color.interpolate = ( from, to, t ) => {
	let fromC = typeof from === "string" ? color( from ) : from,
		toC = typeof to === "string" ? color( to ) : to,
		colorObj = {};

	if ( colorObject.getColorType( toC ) === "rgb" ) {
		fromC = color( fromC.toRGB() );
		colorObj = {
			r: Math.round( numeric.interpolate( fromC.r, toC.r, t ) ),
			g: Math.round( numeric.interpolate( fromC.g, toC.g, t ) ),
			b: Math.round( numeric.interpolate( fromC.b, toC.b, t ) )
		};
	} else {
		fromC = color( fromC.toHSL() );
		colorObj = {
			h: Math.round( numeric.interpolate( fromC.h, toC.h, t ) ),
			s: ( numeric.interpolate( fromC.s, toC.s, t ) ),
			l: ( numeric.interpolate( fromC.l, toC.l, t ) )
		};
	}

	return color(colorObj);
};

// color.singleHuePalette = ( baseHue, colorCount ) => {
// 	let startSaturation = 0.15;
// 	let startLightness = 0.85;
// 	// let startHue =  baseHue - 30;
// 	let colorSpan = [];
// 	let counter = 1;
// 	let incrementor = 0.75 / ( ( colorCount * 2 ) * counter );
// 	// let incrementor = 0.01;
// 	// let lIncrementor = ( startLightness - 10 ) / colorCount;
//
// 	while( startSaturation <= 0.90 && startLightness >= 0.10 ) {
// 		colorSpan.push( `hsl(${baseHue}, ${startSaturation*100}%, ${startLightness*100}%)` );
// 		startSaturation += incrementor;
// 		startLightness -= incrementor;
// 	}
//
// 	return colorSpan;
// };

color.singleHuePalette = ( baseHue, colorCount ) => {
	let startSaturation = 0.15;
	let startLightness = 0.85;
	// let startHue =  baseHue - 30;
	let colorSpan = [];
	// let incrementor = 0.75 / colorCount;
	let incrementor = 0.01;
	// let lIncrementor = ( startLightness - 10 ) / colorCount;

	while( startSaturation <= 0.90 && startLightness >= 0.10 ) {
		colorSpan.push( `hsl(${baseHue}, ${startSaturation*100}%, ${startLightness*100}%)` );
		startSaturation += incrementor;
		startLightness -= incrementor;
	}

	let chosenColors = [];
	let counter = 1;
	while ( ( colorSpan.length / ( colorCount * 2 ) * counter ) < colorSpan.length ) {
		chosenColors.push(colorSpan[Math.round( colorSpan.length / ( colorCount * 2 ) * counter )]);
		counter += 2;
	}

	return chosenColors;
};
