function linear( v, from, to ) {
	let t = ( v - from[0]) / ( from[1] - from[0] );
	return to[0] * (1 - t) + to[1] * t;
}
function piecewise( v, from, to ) {
	let i,
		asc = from[0] < from[1],
		arr = asc ? from : from.slice().reverse();

	if( v <= arr[0] ) {
		i = 0;
	} else if( v > arr[arr.length - 1] ) {
		i = arr.length - 2;
	} else {
		for( i = 0; i < arr.length - 1; i++ ) {
			if( arr[i] <= v && v <= arr[i + 1] ) {
				break;
			}
		}
		if( typeof i === "undefined" ) {
			return NaN;
		}
	}
	return linear(
		v,
		asc ? arr.slice( i, i + 2 ) : arr.slice( i, i + 2 ).reverse(),
		asc ? to.slice( i, i + 2 ) : to.slice( -i - 2 )
	);
}

export default class LinearScale {
	constructor( from = [0, 1], to = [0, 1], ticker ) {
		this.inputDomain = from;
		this.output = to;

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
		this.inputDomain = values;
		this.update();
		return this;
	}

	to( values ) {
		this.output = values;
		this.update();
		return this;
	}

	update() {
		this.domain = this.inputDomain.slice();
		this.domain.length = Math.min( this.inputDomain.length, this.output.length );
		this.minValue = this.domain[0];
		this.maxValue = this.domain[this.domain.length - 1];

		if( this.ticker ) {
			let v = this.ticker.generateTicks( this.minValue, this.maxValue, this.nTicks );
			this.ticks = v.ticks;
			this.minValue = Math.min( v.start, v.end );
			this.maxValue = Math.max( v.start, v.end );
			this.domain[0] = v.start;
			this.domain[this.domain.length - 1] = v.end;
		}
		this.s = this.domain.length <= 2 ? linear : piecewise;
		return this;
	}
	/**
	 *
	 * @param {Number} value
	 * @returns {Number}
	 */
	get( value ) {
		return this.s( value, this.domain, this.output );
	}

	get start() {
		return this.domain[0];
	}

	get end() {
		return this.domain[this.domain.length - 1];
	}
	get min() {
		return this.minValue;
	}
	get max() {
		return this.maxValue;
	}
}
