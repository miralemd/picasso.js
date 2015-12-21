export default class LinearScale {
	constructor( from = [0, 0], to = [0, 0] ) {
		this.domain = from;
		this.output = to;

		this.span = this.domain[1] - this.domain[0];
	}

	/**
	 *
	 * @param {Number[]} values
	 * @returns {LinearScale}
	 */
	from( values ) {
		this.domain = values;
		this.span = this.domain[1] - this.domain[0];
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
		let t = ( value - this.domain[0] ) / this.span;
		return this.output[0] + t * (this.output[1] - this.output[0] );
	}

	get min() {
		return this.domain[0];
	}
	get max() {
		return this.domain[1];
	}
}
