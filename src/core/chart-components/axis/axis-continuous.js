import { Axis } from "./axis";
import { linear } from "../../scales/linear";

function generateMinorTicks( axis, start, end, count ) {
	if ( count <= 0 ) {
		return [];
	}
	const interval = ( end - start ) / count;
	const ticks = [];
	for ( let i = count - 1; i > 0; i-- ) {
		const tick = start + ( interval * i );
		ticks.push( {
			start: start,
			end: end,
			position: tick,
			label: tick,
			isMinor: true
		} );
	}
	return ticks.filter( t => {
		return t.position <= end;
	} );
}

export default class AxisContinuous extends Axis {
	constructor( config, composer, renderer ) {
		super( config, composer, renderer );
		// this.scale = scale;  // Copy scale instead? muteable issues?
		this._minorTicksCount = 4; // Should be set by renderer based on amount of space available and/or use config to toggle on of as option
		this._ticksCountScale = linear().domain( [0, 100] ).range( [0, 1] );
	}

	format( formatter = "s" ) {
		this._formatter = formatter;
		return this;
	}

	// formatting? minor ticks?
	ticksValue( values ){
		return values.map( ( tick, i ) => {
			return {
				start: 0,
				end: 1,
				position: this.scale.get( tick ),
				label: tick,
				index: i,
				minor: []
			};
		} );
	}

	ticks( count = 5 ) {
		const ticks = this.scale.ticks( count );
		const ticksFormatted = ticks.map( this.scale.tickFormat( count, this._formatter ) );
		const tickSpan = ticks[1] - ticks[0]; // TODO cant assume at least 2 ticks

		return ticksFormatted.map( ( tick, i ) => {
			let minorTicks = [];
			if ( i === 0 ) {
				const mStart = generateMinorTicks(
					this,
					this.scale.get( ticks[i] - tickSpan ),
					this.scale.get( ticks[i] ),
					this._minorTicksCount
				);
				const mEnd = generateMinorTicks(
					this,
					this.scale.get( ticks[i] ),
					this.scale.get( ticks[i] + tickSpan ),
					this._minorTicksCount
				);
				minorTicks = mStart.concat( mEnd );
			} else {
				minorTicks = generateMinorTicks(
					this,
					this.scale.get( ticks[i] ),
					this.scale.get( ticks[i] + tickSpan ),
					this._minorTicksCount
				);
			}
			return {
				position: this.scale.get( ticks[i] ),
				label: tick,
				minor: minorTicks
			};
		} );
	}

	onData() {
		const tSet = this._settings.ticks;
		let count = 5;

		if ( tSet.clamp ) {
			this.scale.nice( 5 ); // TODO scale with data granularity
		}

		if ( this._settings.labels.format ) {
			this.format( this._settings.labels.format );
		}

		if ( tSet.values ) {
			if ( tSet.values.length > 1 ) {
				const first = tSet.values[0];
				const last = tSet.values[tSet.values.length - 1];
				this.scale.domain( [first, last] );
			}
			return this.ticksValue( tSet.values );
		} else if ( tSet.count ) {
			count = tSet.count;
		} else if ( tSet.auto ) {
			if ( this._dock === "top" || this._dock === "bottom" ) {
				count = Math.max( this._ticksCountScale.get( this.rect.width - this.rect.x ), 2 );
			} else {
				count = Math.max( this._ticksCountScale.get( this.rect.height - this.rect.y ), 2 );
			}
		}

		this._ticks = this.ticks( count );
		return this;
	}
}

export function axisContinuous( ...a ) {
	return new AxisContinuous( ...a );
}
