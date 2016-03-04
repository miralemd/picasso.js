import hex from "./hex";
import rgb from "./rgb";
import hsl from "./hsl";
import palette from "./color-palette";

let creators = [];
export default function color( ...a ) {
	let cr = creators.filter( c => c.test( ...a ) )[0];
	return cr ? cr.fn( ...a ) : undefined;
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
color.register( palette.test, palette );
