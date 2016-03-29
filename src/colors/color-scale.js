import LinearScale from "../scales/linear";
import interpolators from "./interpolators";
import color from "./color";

/**
 * Instansiates a new linear color scale
 * @param  {[string]} colors     An array of colors
 * @param  {[number]} valueSpace An array of corresponding value ranges
 * @return {object}            A LinearScale object
 */
export default function scale( colors, valueSpace ) {
    let line = new LinearScale();
    line.interpolator = interpolators;
    line.from( valueSpace ).to( colors.map( color ) );
    return line;
}

/**
 * Interpolate a single color over lightness
 * @param  {[string]} c1            The color to interpolate from
 * @param  {[number]} valueSpace    The value range
 * @return {object}                 A linear scale
 */
scale.singleHue = ( c1, valueSpace = [0, 1] ) => {
    let line = new LinearScale(),
    orgCol = color( c1 );
    line.interpolator = interpolators;

    let c2 = color( orgCol.toHSL() ),
        l2 = c2.l;

    c1 = color( orgCol.toHSL() );
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
