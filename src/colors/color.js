import hex from "./hex";
import rgb from "./rgb";
import hsl from "./hsl";
import ColourUtils from "./utils";

import colorKeyWord from "./color-keyword";
import colorObject from "./color-object";
import {default as numeric} from "../scales/interpolators/numeric";
import LinearScale from "../scales/linear";

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
	let fromC = color( from ),
		toC = color( to ),
		colorObj = {};

	if ( typeof fromC === "object" && typeof toC === "object" ) {

		let targetType = colorObject.getColorType( toC );

		if ( targetType === "rgb" ) {
			if ( colorObject.getColorType( fromC ) === "hsl" ) {
				fromC = color( fromC.toRGB() );
			}

			colorObj = {
				r: Math.round( numeric.interpolate( fromC.r, toC.r, t ) ),
				g: Math.round( numeric.interpolate( fromC.g, toC.g, t ) ),
				b: Math.round( numeric.interpolate( fromC.b, toC.b, t ) )
			};
		} else if ( targetType === "hsl" ) {
			if ( colorObject.getColorType( fromC ) === "rgb" ) {
				fromC = color( fromC.toHSL() );
			}

			colorObj = {
				h: Math.round( numeric.interpolate( fromC.h, toC.h, t ) ),
				s: ( numeric.interpolate( fromC.s, toC.s, t ) ),
				l: ( numeric.interpolate( fromC.l, toC.l, t ) )
			};
		}
	}

	return color(colorObj);
};

color.singleHueInterpolator = ( from, to, t ) => {
	let fromC = color( from ),
		toC = color( to ),
		colorObj = {};

	if ( typeof fromC === "object" && typeof toC === "object" ) {

		if ( colorObject.getColorType( fromC ) === "rgb" ) {
			fromC = color( fromC.toHSL() );
		}

		if ( colorObject.getColorType( toC ) === "rgb" ) {
			toC = color( toC.toHSL() );
		}

		colorObj = {
			h: toC.h,
			s: ( numeric.interpolate( fromC.s, toC.s, t ) ),
			l: ( numeric.interpolate( fromC.l, toC.l, t ) )
		};
	}

	return color(colorObj);
};

color.diverging = ( c1, c2, c3, valueSpace = [0, 0.5, 1] ) => {
	return color.linearScale( [c1, c2, c3], valueSpace );
};

color.sequential = ( c1, c2, valueSpace = [0, 1] ) => {
	return color.linearScale( [c1, c2], valueSpace );
};

color.sequentialHue = ( c1, valueSpace = [0, 1] ) => {
	let line = new LinearScale();
	line.interpolator = { interpolate: color.singleHueInterpolator };
	let c2 = color( color( c1 ).toHSL() ),
		l2 = c2.l;

	c1 = color( color( c1 ).toHSL() );
	let l1 = c1.l;

	line.from( valueSpace ).to( [c1, c2] );

	var classify = line.classify;
	line.classify = function( numIntervals ) {
		if ( numIntervals > 1 ) {
			c2.l = Math.max( Math.min( l2, 0.9 ) - 0.20 * Math.round(numIntervals / 2), 0.1 );
			c1.l = Math.min( Math.max( l1, 0.1 ) + 0.20 * Math.round(numIntervals / 2), 0.9 );
		}

		classify.call( line, numIntervals );
		return this;
	};

	return line;
};

color.linearScale = ( colors, valueSpace ) => {
	let line = new LinearScale();
	line.interpolator = { interpolate: color.interpolate };
	line.from( valueSpace ).to( colors.map( c => { return color(c); } ) );
	return line;
};

color.palettes = {
	scientific: (min, max) => {
		let colorPalette = ["#3d52a1", "#3d52a1", "#3a89c9", "#3a89c9", "#77b7e5", "#77b7e5", "#b4ddf7", "#b4ddf7", "#e6f5fe", "#e6f5fe",
			"#ffe3aa", "#ffe3aa", "#f9bd7e", "#f9bd7e", "#ed875e", "#ed875e", "#d24d3e", "#d24d3e", "#ae1c3e", "#ae1c3e"].map((c) => {
			return color(c);
		});
		let from = [];
		let incrementor = ( max - min ) / ( colorPalette.length - 1 );
		colorPalette.forEach(function (item, index) {
			from.push(incrementor * index);
		});

		let line = new LinearScale();
		line.interpolator = {interpolate: color.interpolate};
		line.from(from).to(colorPalette);
		return line;
	},
	multiHue: ( min, max ) => {
		let colorPalette = ["#fee391", "#fee391", "#fec44f", "#fec44f", "#fb9a29", "#fb9a29", "#ec7014", "#ec7014", "#cc4c02", "#cc4c02", "#993404", "#993404", "#662506", "#662506"].map( ( c ) => {
			return color(c);
		});
		let from = [];
		let incrementor = ( max - min ) / ( colorPalette.length - 1 );
		colorPalette.forEach( function ( item, index ) {
			from.push( incrementor * index );
		});

		let line = new LinearScale();
		line.interpolator = { interpolate: color.interpolate };
		line.from( from ).to( colorPalette );
		return line;
	}
};

color.utils = new ColourUtils();
