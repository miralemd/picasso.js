import { scaleOrdinal } from "d3-scale";
import Events from "../utils/event-emitter";

export default class OrdinalScale {
	/**
	 * Class representing a OrdinalScale
	 * @param { Object[] } [ domain=[] ] The domain values
	 * @param { Object[] } [ range=[] ] The range values
	 */
	constructor( domain = [], range = [] ) {
		this._scale = scaleOrdinal();
		this.domain( domain );
		this.range( range );
	}

	/**
	 * @param { Object[] } [values] Set or Get domain values
	 * @return { OrdinalScale | Object[] } The instance this method was called on if a parameter is provided, otherwise the current domain is returned
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
	 * @param { Object[] } [values] Set or Get range values
	 * @return { OrdinalScale | Object[] } The instance this method was called on if a parameter is provided, otherwise the current range is returned
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
	 * {@link https://github.com/d3/d3-scale#ordinal_unknown }
	 * @param { Number } value
	 * @return { Number }
	 */
	unknown( value ) {
		if ( arguments.length ) {
			this._scale.unknown( value );
			this.emit( "changed" );
			return this;
		}
		return this._scale.unknown();
	}

	/**
	 * {@link https://github.com/d3/d3-scale#_ordinal }
	 * @param { Number } value
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

Events.mixin( OrdinalScale.prototype );

/**
 * OrdinalScale instantiator
 * @param { Object[] } [ domain=[] ] The domain values
 * @param { Object[] } [ range=[] ] The range values
 * @return { OrdinalScale } OrdinalScale instance
 */
export function ordinal( ...a ) {
	return new OrdinalScale( ...a );
}
