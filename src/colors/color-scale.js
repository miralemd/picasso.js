import { default as numeric } from "../scales/interpolators/numeric";
import LinearScale from "../scales/linear";
import colorObject from "./instantiator/color-object";

const interpolator = {};

/**
 * Instansiates a new linear color scale
 * @param  {[string]} colors     An array of colors
 * @param  {[number]} valueSpace An array of corresponding value ranges
 * @return {object}            A LinearScale object
 */
export default function scale( colors, valueSpace ){
    let line = new LinearScale();
    interpolator.interpolate = scale.interpolate;
    line.interpolator = interpolator;
    line.from( valueSpace ).to( colors.map( scale.color ) );
    return line;
}

function singleHueInterpolator( from, to, t ) {
    let fromC = scale.color( from ),
        toC = scale.color( to ),
        colorObj = {};

    if ( typeof fromC === "object" && typeof toC === "object" ) {

        if ( colorObject.getColorType( fromC ) === "rgb" ) {
            fromC = scale.color( fromC.toHSL() );
        }

        if ( colorObject.getColorType( toC ) === "rgb" ) {
            toC = scale.color( toC.toHSL() );
        }

        colorObj = {
            h: toC.h,
            s: ( numeric.interpolate( fromC.s, toC.s, t ) ),
            l: ( numeric.interpolate( fromC.l, toC.l, t ) )
        };
    }

    return scale.color(colorObj);
}

/**
* Interpolate two colors
* @param  {object} from The color to interpolate from
* @param  {object} to   The color to interpolate to
* @param  {Number} t	A number between [0-1]
* @return {object}	  The interpolated color
*/
scale.interpolate = ( from, to, t ) => {
    let fromC = scale.color( from ),
        toC = scale.color( to ),
        colorObj = {};

    if ( typeof fromC === "object" && typeof toC === "object" ) {

        let targetType = colorObject.getColorType( toC );

        if ( targetType === "rgb" ) {
            if ( colorObject.getColorType( fromC ) === "hsl" ) {
                fromC = scale.color( fromC.toRGB() );
            }

            colorObj = {
                r: Math.round( numeric.interpolate( fromC.r, toC.r, t ) ),
                g: Math.round( numeric.interpolate( fromC.g, toC.g, t ) ),
                b: Math.round( numeric.interpolate( fromC.b, toC.b, t ) )
            };
        } else if ( targetType === "hsl" ) {
            if ( colorObject.getColorType( fromC ) === "rgb" ) {
                fromC = scale.color( fromC.toHSL() );
            }

            colorObj = {
                h: Math.round( numeric.interpolate( fromC.h, toC.h, t ) ),
                s: ( numeric.interpolate( fromC.s, toC.s, t ) ),
                l: ( numeric.interpolate( fromC.l, toC.l, t ) )
            };
        }
    }

    return scale.color(colorObj);
};

/**
 * Interpolate a single color over lightness
 * @param  {[string]} c1            The color to interpolate from
 * @param  {[number]} valueSpace    The value range
 * @return {object}                 A linear scale
 */
scale.singleHue = ( c1, valueSpace = [0, 1] ) => {
    let line = new LinearScale();
    interpolator.interpolate = singleHueInterpolator;
    line.interpolator = interpolator;
    let c2 = scale.color( scale.color( c1 ).toHSL() ),
        l2 = c2.l;

    c1 = scale.color( scale.color( c1 ).toHSL() );
    let l1 = c1.l;

    // Set default values for lightness interpolation
    if ( l1 > 0.5 ) {
        c2.l = Math.max( Math.min( l2, 0.9 ) - 0.40, 0.1 );
        //c1.l = Math.min( Math.max( l1, 0.1 ) + 0.10, 0.9 );
    } else {
        c1.l = Math.min( Math.max( l1, 0.1 ) + 0.40, 0.9 );
        //c2.l = Math.max( Math.min( l2, 0.9 ) - 0.10, 0.1 );
    }

    line.from( valueSpace ).to( [c1, c2] );

    var classify = line.classify;
    line.classify = function( intervals ) {
        if ( intervals > 1 ) {
            c2.l = Math.max( Math.min( l2, 0.9 ) - 0.20 * Math.round( intervals / 2 ), 0.1 );
            c1.l = Math.min( Math.max( l1, 0.1 ) + 0.20 * Math.round( intervals / 2 ), 0.9 );
        }

        classify.call( line, intervals );
        return this;
    };

    return line;
};
