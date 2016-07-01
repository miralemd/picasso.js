import { default as ticker } from "../../scales/ticks";

function generateMinorTicks( axis, start, end, count ) {
	if ( count <= 0 ) {
		return [];
	}
	return ticker.generateTicks( start, end, count, true ).ticks.map( ( tick, i ) => {
		return {
			start: start,
			end: end,
			position: tick,
			index: i,
			label: tick
		};
	} ).filter( ( t ) => {
		if ( start <= end ) {
			return t.label > start && t.label < end;
		}
		return t.label < start && t.label > end;
	} );
}

export default class AxisContinuous {
	constructor( scale ) {
		this.scale = scale;  // Copy scale instead? muteable issues?
		this._minorTicksCount = 0;
		// TODO Range must be continuous and numeric?
	}

	format( formatter = "s" ) {
		this._formatter = formatter;
		return this;
	}

	nice( count = 10 ) {
		this.scale.nice( count );
		return this;
	}

	ticks( count = 5 ) {
		const ticks = this.scale.ticks( count );
		const ticksFormatted = ticks.map( this.scale.tickFormat( count, this._formatter ) );

		return ticksFormatted.map( ( tick, i ) => {
			return {
				start: 0,
				end: 1,
				position: this.scale.get( ticks[i] ),
				label: tick,
				index: i,
				minor: generateMinorTicks( this, this.scale.get( ticks[i] ), this.scale.get( ticks[i + 1] ), this._minorTicksCount )
			 };
		} );
	}

	minorTicks( count = 0 ) {
		this._minorTicksCount = count;
		return this;
	}
}

export function axisContinuous( ...a ) {
	return new AxisContinuous( ...a );
}
