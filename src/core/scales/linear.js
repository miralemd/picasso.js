import { scaleLinear } from "d3-scale";
import Events from "../utils/event-emitter";

export default class LinearScale {
	constructor( domain = [0, 1], range = [0, 1] ) {
		this._scale = scaleLinear();
		this.domain( domain );
		this.range( range );
	}

	/**
	 * https://github.com/d3/d3-scale#continuous_invert
	 * @param {Number} value The inverted value
	 * @return {Number}
	 */
	invert( value ) {
		return this._scale.invert( value );
	}

	/**
	 * https://github.com/d3/d3-scale#continuous_rangeRound
	 * @param {Array} values Range values
	 * @return {LinearScale}
	 */
	rangeRound( values ) {
		this._scale.rangeRound( values );
		this.emit( "changed" );
		return this;
	}

	/**
	 * https://github.com/d3/d3-scale#continuous_clamp
	 * @param {boolean} value True if clamp should be enabled
	 * @return {LinearScale}
	 */
	clamp( value ) {
		this._scale.clamp( value );
		this.emit( "changed" );
		return this;
	}

	/**
	 * https://github.com/d3/d3-scale#continuous_ticks
	 * @param {Number} count Number of ticks to generate
	 * @return {Array} Array of ticks
	 */
	ticks( count ) {
		return this._scale.ticks( count );
	}

	/**
	 * https://github.com/d3/d3-scale#continuous_nice
	 * @param {Number} count
	 * @return {LinearScale}
	 */
	nice( count ) {
		this._scale.nice( count );
		this.emit( "changed" );
		return this;
	}

	// TODO Support this?
	ticksFormat( count, format ) {
		return this._scale.ticksFormat( count, format );
	}

	// TODO Support this?
	interpolate( fn ) {
		this._scale.interpolate( fn );
	}

	/**
	 * @param {Number[]} Domain values
	 * @return {LinearScale}
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
	 * @param {Number[]} Range values
	 * @return {LinearScale}
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
	 * https://github.com/d3/d3-scale#_continuous
	 * @param {Number} value
	 * @return {Number}
	 */
	get( value ) {
		return this._scale( value );
	}

	/**
	 * Get the first value of the domain
	 * @return {Number}
	 */
	get start() {
		return this.domain()[0];
	}

	/**
	 * Get the last value of the domain
	 * @return {Number}
	 */
	get end() {
		return this.domain()[this.domain().length - 1];
	}

	/**
	 * Get the min value of the domain
	 * @return {Number}
	 */
	get min() {
		return Math.min( this.start, this.end );
	}

	/**
	 * Get the max value of the domain
	 * @return {Number}
	 */
	get max() {
		return Math.max( this.start, this.end );
	}

	/**
	 * Creates an interval scale for the given data range
	 * @param  {number} intervals 		The number of interval points
	 * @return {object}                	LinearScale
	 */
	classify( intervals ) {
		let valueRange = ( this.start - this.end ) / intervals,
			domain = [this.end],
			range = [],
			samplePos = valueRange / 2;

		for ( let i = 0; i < intervals; i++ ) {
			let lastVal = domain[domain.length - 1] || 0,
				calIntervalPos = lastVal + valueRange,
				calSamplePos = lastVal + samplePos,
				sampleColValue = this.get( calSamplePos );

			domain.push.apply( domain, [calIntervalPos, calIntervalPos] );
			range.push.apply( range, [sampleColValue, sampleColValue] );
		}
		domain.pop();
		this.domain( domain );
		this.range( range );

		return this;
	}
}

Events.mixin( LinearScale.prototype );

export function linear( ...a ) {
	return new LinearScale( ...a );
}
