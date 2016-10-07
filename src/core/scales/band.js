import { scaleBand } from "d3-scale";
import Events from "../utils/event-emitter";

export default class BandScale {
	/**
	 * Class representing a BandScale
	 * @param { Object[] } [ domain=[] ] The domain values
	 * @param { Number[] } [ range=[] ] The range values
	 */
	constructor( domain = [], range = [] ) {
		this._scale = scaleBand();
		this.domain( domain );
		this.range( range );
	}

	/**
	 * @param { Object[] } [values] Set or Get domain values
	 * @return { BandScale | Object[] } The instance this method was called on if a parameter is provided, otherwise the current domain is returned
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
	 * @return { BandScale | Number[] } The instance this method was called on if a parameter is provided, otherwise the current range is returned
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
	 * {@link https://github.com/d3/d3-scale#band_paddingOuter }
	 * @param { Number } value A value within 0-1
	 * @return { BandScale } The instance this method was called on
	 */
	paddingOuter( padding = 0 ) {
		this._scale.paddingOuter( padding );
		this.emit( "changed" );
		return this;
	}

	/**
	 * {@link https://github.com/d3/d3-scale#band_paddingInner }
	 * @param { Number } value A value within 0-1
	 * @return { BandScale } The instance this method was called on
	 */
	paddingInner( padding = 0 ) {
		this._scale.paddingInner( padding );
		this.emit( "changed" );
		return this;
	}

	/**
	 * {@link https://github.com/d3/d3-scale#band_padding }
	 * @param { Number } value A value within 0-1
	 * @return { BandScale } The instance this method was called on
	 */
	padding( padding = 0 ) {
		this._scale.padding( padding );
		this.emit( "changed" );
		return this;
	}

	/**
	 * {@link https://github.com/d3/d3-scale#band_padding }
	 * @param { Number } value A value within 0-1
	 * @return { BandScale } The instance this method was called on
	 */
	align( align ) {
		this._scale.align( align );
		this.emit( "changed" );
		return this;
	}

	/**
	 * {@link https://github.com/d3/d3-scale#band_align }
	 * @return { Number } Bandwith of each band
	 */
	bandWidth() {
		return this._scale.bandwidth();
	}

	/**
	 * {@link https://github.com/d3/d3-scale#band_step }
	 * @return { Number } Step distance
	 */
	step() {
		return this._scale.step();
	}

	/**
	 * {@link https://github.com/d3/d3-scale#_band }
	 * @param { Object } value
	 * @return { Number }
	 */
	get( value ) {
		return this._scale( value );
	}

	/**
	 * Get the first value of the domain
	 * @return { Number }
	 */
	get start() {
		return this.domain()[0];
	}

	/**
	 * Get the last value of the domain
	 * @return { Number }
	 */
	get end() {
		return this.domain()[this.domain().length - 1];
	}
}

Events.mixin( BandScale.prototype );

/**
 * BandScale instantiator
 * @param { Object[] } [ domain=[] ] The domain values
 * @param { Number[] } [ range=[] ] The range values
 * @return { BandScale } BandScale instance
 */
export function band( ...a ) {
	return new BandScale( ...a );
}
