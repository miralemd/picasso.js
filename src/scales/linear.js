import numeric from "./interpolators/numeric";

function lerp( v, from, to, interp ) {
	let t = ( v - from[0]) / ( from[1] - from[0] );
	return interp.interpolate( to[0], to[1], t );
}

function piecewise( v, from, to, interp ) {
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
	return lerp(
		v,
		asc ? arr.slice( i, i + 2 ) : arr.slice( i, i + 2 ).reverse(),
		asc ? to.slice( i, i + 2 ) : to.slice( -i - 2 ),
		interp
	);
}

export default class LinearScale {
	constructor( from = [0, 1], to = [0, 1], ticker ) {
		this.inputDomain = from;
		this.output = to;

		this.ticker = ticker;
		this.nTicks = 2;
		this.interpolator = numeric;
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
		this.s = this.domain.length <= 2 ? lerp : piecewise;
		return this;
	}
	/**
	 *
	 * @param {Number} value
	 * @returns {Number}
	 */
	get( value ) {
		return this.s( value, this.domain, this.output, this.interpolator );
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

/**
 * Creates an interval scale for the given data range
 * @param  {number} intervals 		The number of interval points
 * @return {object}                	LinearScale
 */
	classify( intervals ) {
		let valueRange = ( this.maxValue - this.minValue ) / intervals,
			newFrom = [this.minValue],
			newTo = [],
			samplePos = valueRange / 2;

		for ( let i = 0; i < intervals; i++ ) {
			let lastVal = newFrom[newFrom.length - 1] || 0,
				calIntervalPos = lastVal + valueRange,
				calSamplePos = lastVal + samplePos,
				sampleColValue = this.get( calSamplePos );

			newFrom.push( calIntervalPos );
			newFrom.push( calIntervalPos );
			newTo.push( sampleColValue );
			newTo.push( sampleColValue );
		}
		newFrom.pop();
		this.from(newFrom);
		this.to(newTo);

		return this;
	}
}


export function linear( ...a ) {
	return new LinearScale( ...a );
}
