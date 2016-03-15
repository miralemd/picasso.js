import { default as numeric } from "../scales/interpolators/numeric";
import LinearScale from "../scales/linear";
import colorObject from "./instantiator/color-object";

export default function scale( colors, valueSpace ){
    let line = new LinearScale();
    line.interpolator = { interpolate: scale.interpolate };
    line.from( valueSpace ).to( colors.map( c => { return scale.color( c ); } ) );
    return line;
}

let singleHueInterpolator = ( from, to, t ) => {
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
};

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

scale.singleHue = ( c1, valueSpace = [0, 1] ) => {
    let line = new LinearScale();
    line.interpolator = { interpolate: singleHueInterpolator };
    let c2 = scale.color( scale.color( c1 ).toHSL() ),
        l2 = c2.l;

    c1 = scale.color( scale.color( c1 ).toHSL() );
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
