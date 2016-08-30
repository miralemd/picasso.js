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

	paddingOuter( padding = 0 ) {
		this._scale.paddingOuter( padding );
		this.emit( "changed" );
		return this;
	}

	paddingInner( padding = 0 ) {
		this._scale.paddingInner( padding );
		this.emit( "changed" );
		return this;
	}

	padding( padding = 0 ) {
		this._scale.padding( padding );
		this.emit( "changed" );
		return this;
	}

	align( align ) {
		this._scale.align( align );
		this.emit( "changed" );
		return this;
	}

	bandWidth() {
		return this._scale.bandwidth();
	}

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
