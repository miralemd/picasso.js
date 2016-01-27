export default class LinearScale {
	constructor( from = [0, 0], to = [0, 0], ticker ) {
		this.domain = from;
		this.output = to;

		this.span = this.domain[1] - this.domain[0];
		this.ticker = ticker;
		this.nTicks = 2;
		this.update();
	}

	/**
	 *
	 * @param {Number[]} values
	 * @returns {LinearScale}
	 */
	from( values ) {
		this.domain = values;
		this.update();
		return this;
	}

	to( values ) {
		this.output = values;
		return this;
	}

	update() {
		this.minValue = this.domain[0];
		this.maxValue = this.domain[1];
		if( this.ticker ) {
			let v = this.ticker.generateTicks( this.minValue, this.maxValue, this.nTicks );
			this.ticks = v.ticks;
			this.minValue = v.min;
			this.maxValue = v.max;
		}
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
