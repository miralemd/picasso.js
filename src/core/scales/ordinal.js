import { scaleOrdinal } from "d3-scale";
import Events from "../utils/event-emitter";

export default class OrdinalScale {
	constructor( domain = [], range = [] ) {
		this._scale = scaleOrdinal();
		this.domain( domain );
		this.range( range );
	}

	/**
	 * @param {Array} Domain values
	 * @return {OrdinalScale}
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
	 * @param {Array} Range values
	 * @return {OrdinalScale}
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
	 * https://github.com/d3/d3-scale#ordinal_unknown
	 * @param {Number} value
	 * @return {Number}
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
	 * https://github.com/d3/d3-scale#_ordinal
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
}

Events.mixin( OrdinalScale.prototype );

export function ordinal( ...a ) {
	return new OrdinalScale( ...a );
}
