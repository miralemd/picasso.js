export default class LinearScale {
	constructor( from = [0, 0], to = [0, 0], ticker ) {
		this.domain = from;
		this.output = to;

		this.span = this.domain[1] - this.domain[0];
		this.minValue = this.domain[0];
		this.maxValue = this.domain[1];
		this.ticker = ticker;
		if( this.ticker ) {
			this.ticks = this.ticker.generateTicks( this.minValue, this.maxValue, 6 );
			this.minValue = this.ticks[0];
			this.maxValue = this.ticks[this.ticks.length - 1];
		}
	}

	/**
	 *
	 * @param {Number[]} values
	 * @returns {LinearScale}
	 */
	from( values ) {
		this.domain = values;
		this.minValue = this.domain[0];
		this.maxValue = this.domain[1];
		if( this.ticker ) {
			this.ticks = this.ticker.generateTicks( this.minValue, this.maxValue, 6 );
			this.minValue = this.ticks[0];
			this.maxValue = this.ticks[this.ticks.length - 1];
		}
		return this;
	}

	to( values ) {
		this.output = values;
		return this;
	}

	/**
	 *
	 * @param {Number} value
	 * @returns {Number}
	 */
	get( value ) {
		let t = ( value - this.minValue) / ( this.maxValue - this.minValue );
		return this.output[0] + t * (this.output[1] - this.output[0] );
	}

	get min() {
		return this.minValue;
	}
	get max() {
		return this.maxValue;
	}
}
