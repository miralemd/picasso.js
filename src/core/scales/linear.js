import { scaleLinear } from "d3-scale";
import Events from "../utils/event-emitter";

function applyFormat( formatter ) {
	return typeof formatter === "undefined" ? t => t : t => formatter( t );
}

class LinearScale {
	/**
	 * Class representing a linear scale
	 * @private
	 * @param { Number[] } [ domain=[0,1] ] The domain values
	 * @param { Number[] } [ range=[0,1] ] The range values
	 */
	constructor( domain = [0, 1], range = [0, 1] ) {
		this._scale = scaleLinear();
		this.domain( domain );
		this.range( range );
	}

	/**
	 * {@link https://github.com/d3/d3-scale#continuous_invert }
	 * @param { Number } value The inverted value
	 * @return { Number } The inverted value
	 */
	invert( value ) {
		return this._scale.invert( value );
	}

	/**
	 * {@link https://github.com/d3/d3-scale#continuous_rangeRound }
	 * @param { Number[] } values Range values
	 * @return { LinearScale } The instance this method was called on
	 */
	rangeRound( values ) {
		this._scale.rangeRound( values );
		this.emit( "changed" );
		return this;
	}

	/**
	 * {@link https://github.com/d3/d3-scale#continuous_clamp }
	 * @param { Boolean } [ value=true ] TRUE if clamping should be enabled
	 * @return { LinearScale } The instance this method was called on
	 */
	clamp( value = true ) {
		this._scale.clamp( value );
		this.emit( "changed" );
		return this;
	}

	/**
	 * {@link https://github.com/d3/d3-scale#continuous_ticks }
	 * @param { Object } input Number of ticks to generate or an object passed to tick generator
	 * @return { Number[] | Object } Array of ticks or any type the custom tick generator returns
	 */
	ticks( input ) {
		if ( typeof this._tickGenerator === "function" ) {
			return this._tickGenerator.call( null, input );
		}
		return this._scale.ticks( input );
	}

	/**
	 * {@link https://github.com/d3/d3-scale#continuous_nice }
	 * @param { Number } count
	 * @return { LinearScale } The instance this method was called on
	 */
	nice( count ) {
		this._scale.nice( count );
		this.emit( "changed" );
		return this;
	}

	// TODO Support this?
	tickFormat( count, format ) {
		return this._scale.tickFormat( count, format );
	}

	// TODO Support this?
	interpolate( fn ) {
		this._scale.interpolate( fn );
	}

	/**
	 * @param { Number[] } [values] Set or Get domain values
	 * @return { LinearScale | Number[] } The instance this method was called on if a parameter is provided, otherwise the current domain is returned
	 */
	domain( values ) {
		if ( arguments.length ) {
			this._scale.domain( values );
			this.emit( "changed" );
			return this;
		}
		return this._scale.domain();
	}

	/**
	 * @param { Number[] } [values] Set or Get range values
	 * @return { LinearScale | Number[] } The instance this method was called on if a parameter is provided, otherwise the current range is returned
	 */
	range( values ) {
		if ( arguments.length ) {
			this._scale.range( values );
			this.emit( "changed" );
			return this;
		}
		return this._scale.range();
	}

	/**
	 * {@link https://github.com/d3/d3-scale#_continuous }
	 * @param { Number } value A value within the domain value span
	 * @return { Number } Interpolated from the range
	 */
	get( value ) {
		return this._scale( value );
	}

	/**
	 * Get the first value of the domain
	 * @return { Number }
	 */
	start() {
		return this.domain()[0];
	}

	/**
	 * Get the last value of the domain
	 * @return { Number }
	 */
	end() {
		return this.domain()[this.domain().length - 1];
	}

	/**
	 * Get the minimum value of the domain
	 * @return { Number }
	 */
	min() {
		return Math.min( this.start(), this.end() );
	}

	/**
	 * Get the maximum value of the domain
	 * @return { Number }
	 */
	max() {
		return Math.max( this.start(), this.end() );
	}

	/**
	 * Assign a tick generator. Will be used when calling ticks function
	 * @param  { Function } generator Tick generator function
	 * @return { LinearScale } The instance this method was called on
	 */
	tickGenerator( generator ) {
		this._tickGenerator = generator;
		return this;
	}

	/**
	 * Divides the domain and range into uniform segments, based on start and end value
	 * @param  { Number } segments The number of segments
	 * @return { LinearScale } The instance this method was called on
	 * @example
	 * let s = new LinearScale( [0, 10], [0, 1] );
	 * s.classify( 2 );
	 * s.domain(); // [10, 5, 5, 0]
	 * s.range(); // [0.75, 0.75, 0.25, 0.25]
	 */
	classify( segments ) {
		let valueRange = ( this.start() - this.end() ) / segments,
			domain = [this.end()],
			range = [],
			samplePos = valueRange / 2;

		for ( let i = 0; i < segments; i++ ) {
			let lastVal = domain[domain.length - 1] || 0,
				calIntervalPos = lastVal + valueRange,
				calSamplePos = lastVal + samplePos,
				sampleColValue = this.get( calSamplePos );

			domain.push( ...[calIntervalPos, calIntervalPos] );
			range.push( ...[sampleColValue, sampleColValue] );
		}
		domain.pop();
		this.domain( domain );
		this.range( range );

		return this;
	}

	copy() {
		return new LinearScale( this.domain(), this.range() )
			.clamp( this._scale.clamp() );
	}
}

Events.mixin( LinearScale.prototype );

/**
 * LinearScale instantiator
 * @private
 * @param { Number[] } [ domain=[0,1] ] The domain values
 * @param { Number[] } [ range=[0,1] ] The range values
 * @return { LinearScale } LinearScale instance
 */
export function linear( ...a ) {
	return new LinearScale( ...a );
}


/**
* Generate ticks based on a distance, for each 100th unit, one additional tick may be added
* @private
* @param  {Number} distance 			Distance between each tick
* @param  {Number} scale 				The scale instance
* @param  {Number} [minorCount=0] 		Number of tick added between each distance
* @param  {Number} [unitDivider=100] 	Number to divide distance with
* @return {Array}       				Array of ticks
*/
export function looseDistanceBasedGenerator( { distance, minorCount = 0, start = 0, end = 1, unitDivider = 100, formatter = undefined } ) {
	let scale = scaleLinear();
	scale.domain( [start, end] );
	scale.range( [0, 1] );

	const fraction = Math.max( distance / unitDivider, 2 );
	let count = ( ( fraction - 1 ) * minorCount ) + fraction;
	let ticks = scale.ticks( count );
	if ( ticks.length <= 1 ) {
		ticks = scale.ticks( count + 1 );
	}

	let ticksFormatted = ticks.map( applyFormat( formatter ) );

	return ticks.map( ( tick, i ) => {
		return {
			position: scale( tick ),
			label: ticksFormatted[i],
			isMinor: i % ( minorCount + 1 ) !== 0
		};
	} );
}

/**
* Generate ticks based on a distance, for each 100th unit, one additional tick may be added.
* Will attempt to round the bounds of domain to even values and generate ticks hitting the domain bounds.
* @private
* @param  {Number} distance 			Distance between each tick
* @param  {Number} scale 				The scale instance
* @param  {Number} [minorCount=0] 		Number of tick added between each distance
* @param  {Number} [unitDivider=100] 	Number to divide distance with
* @return {Array}       				Array of ticks
*/
export function tightDistanceBasedGenerator( { distance, minorCount = 0, start = 0, end = 1, unitDivider = 100, formatter = undefined } ) {
	let scale = scaleLinear();
	scale.domain( [start, end] );
	scale.range( [0, 1] );
	const count = Math.max( distance / unitDivider, 2 );
	const ticksCount = Math.round( ( ( count - 1 ) * minorCount ) + count );
	const n = ticksCount > 10 ? 10 : ticksCount;
	scale.nice( n );

	let ticks = scale.ticks( ticksCount );
	let ticksFormatted = ticks.map( applyFormat( formatter ) );

	return ticks.map( ( tick, i ) => {
		return {
			position: scale( tick ),
			label: ticksFormatted[i],
			isMinor: i % ( minorCount + 1 ) !== 0
		};
	} );
}

export default LinearScale;
