import hex from "./instantiator/hex";
import rgb from "./instantiator/rgb";
import hsl from "./instantiator/hsl";
import colorKeyWord from "./instantiator/color-keyword";
import colorObject from "./instantiator/color-object";
import {default as colourUtils} from "./utils";
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
			return color( c );
		});

		let from = rangeCal( min, max, colorPalette );

		return color.scale( colorPalette, from );
	},

	colors12: () => {

		let colorPalette = [
			"#332288", "#6699cc", "#88ccee", "#44aa99", "#117733", "#999933",
			"#ddcc77", "#661100", "#cc6677", "#aa4466", "#882255", "#aa4499"
		].map( ( c ) => {
			return color( c );
		});

		return colorPalette;

	},

	colors100: () => {
		let colorPalette = [
			"#99c867", "#e43cd0", "#e2402a", "#66a8db", "#3f1a20", "#e5aa87", "#3c6b59", "#aa2a6b", "#e9b02e", "#7864dd",
			"#65e93c", "#5ce4ba", "#d0e0da", "#d796dd", "#64487b", "#e4e72b", "#6f7330", "#932834", "#ae6c7d", "#986717",
			"#e3cb70", "#408c1d", "#dd325f", "#533d1c", "#2a3c54", "#db7127", "#72e3e2", "#e2c1da", "#d47555", "#7d7f81",
			"#54ae9b", "#e9daa6", "#3a8855", "#5be66e", "#ab39a4", "#a6e332", "#6c469d", "#e39e51", "#4f1c42", "#273c1c",
			"#aa972e", "#8bb32a", "#bdeca5", "#63ec9b", "#9c3519", "#aaa484", "#72256d", "#4d749f", "#9884df", "#e590b8",
			"#44b62b", "#ad5792", "#c65dea", "#e670ca", "#e38783", "#29312d", "#6a2c1e", "#d7b1aa", "#b1e7c3", "#cdc134",
			"#9ee764", "#56b8ce", "#2c6323", "#65464a", "#b1cfea", "#3c7481", "#3a4e96", "#6493e1", "#db5656", "#747259",
			"#bbabe4", "#e33f92", "#d0607d", "#759f79", "#9d6b5e", "#8574ae", "#7e304c", "#ad8fac", "#4b77de", "#647e17",
			"#b9c379", "#8da8b0", "#b972d9", "#786279", "#7ec07d", "#916436", "#2d274f", "#dce680", "#759748", "#dae65a",
			"#459c49", "#b7934a", "#51c671", "#9ead3f", "#969a5c", "#b9976a", "#46531a", "#c0f084", "#76c146", "#bad0ad"
		].map( ( c ) => {
			return color( c );
		});

		return colorPalette;
	}
};

color.utils = colourUtils;
