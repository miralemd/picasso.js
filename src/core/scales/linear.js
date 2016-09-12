import { scaleLinear } from "d3-scale";
import Events from "../utils/event-emitter";

export default class LinearScale {
	/**
	 * Class representing a linear scale
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
	 * @param { Number } count Number of ticks to generate
	 * @return { Number[] } Array of ticks
	 */
	ticks( count ) {
		return this._scale.ticks( count );
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
	 * Get magic ticks for usage with grid and axis
	 * @param  {Number} width 		Width of the element where we're drawing
	 * @param  {Number} minorCount 	The number of minors you would want
	 * @return {Array}       		Array of ticks with position
	 */
	magicTicks( width, minorCount = 3 ) {
		let magicScale = scaleLinear();
		magicScale.domain( [0, 100] );
		magicScale.range( [0, 1] );

		let count = Math.max( magicScale( width ), 2 );

		let ticks = this.ticks( ( ( count - 1 ) * minorCount ) + count );
		const ticksFormatted = ticks.map( this.tickFormat( count, "s" ) );

		return ticksFormatted.map( ( tick, i ) => {
			return {
				position: this.get( ticks[i] ),
				label: tick,
				isMinor: i % ( minorCount + 1 ) !== 0
			};
		} );
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
}

Events.mixin( LinearScale.prototype );

/**
 * LinearScale instantiator
 * @param { Number[] } [ domain=[0,1] ] The domain values
 * @param { Number[] } [ range=[0,1] ] The range values
 * @return { LinearScale } LinearScale instance
 */
export function linear( ...a ) {
	return new LinearScale( ...a );
}
