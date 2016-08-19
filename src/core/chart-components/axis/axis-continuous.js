import { Axis } from "./axis";
import { linear } from "../../scales/linear";
import { AxisHelpers as helpers } from "./axis-helpers";

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
		return t.position >= 0 && t.position <= 1;
	} );
}

export default class AxisContinuous extends Axis {
	constructor( config, composer, renderer ) {
		super( config, composer, renderer );
		this._minorTicksCount = 4; // Should be set by renderer based on amount of space available and/or use config to toggle on of as option
		this._ticksCountScale = linear().domain( [0, 100] ).range( [0, 1] );
	}

	settings( opt ) {
		this._settings = {
			direction: "ltl",
			title: {
				value: "Fake title asdaadasd asda das das das das dasd as dasdasdasd",
				show: true,
				style: {
					font: "Arial",
					size: 15,
					color: "#999"
				},
				padding: 15
			},
			labels: {
				show: true,
				tilted: false,
				style: {
					font: "Arial",
					size: 13,
					color: "#999"
				},
				format: "s",
				padding: 4
			},
			line: {
				show: true,
				style: {
					size: 1,
					color: "#999"
				}
			},
			ticks: {
				show: true,
				auto: true,
				padding: 0,
				// max: 0, // Set max value on axis, modifies domain end
				// min: 0, // Set min value on axis, modifies domain start
				// count: 10, // overrides auto
				// clamp: true, // if start and end should always have a tick, use nice?
				// values: [0, 1, 2], // overrides count and auto
				style: {
					// auto: true, // if size of thicks should be scaled with available draw rect
					size: 8, // TODO unify format for size
					color: "#999",
					thickness: 1
					// length: 1
				}
			},
			minorTicks: {
				show: true,
				auto: true,
				padding: 0,
				style: {
					// auto: true,
					size: 3,
					color: "#999",
					thickness: 1
				},
				count: 3
			}
		};
		helpers.applyData( this._settings, opt );
		return this;
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

		if ( Number.isInteger( tSet.min ) || Number.isInteger( tSet.max ) ) {
			const d = [ Number.isInteger( tSet.min ) ? tSet.min : this.scale.start(), Number.isInteger( tSet.max ) ? tSet.max : this.scale.end() ];
			this.scale.domain( d );
		} else if ( tSet.clamp ) {
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

			this._ticks = this.ticksValue( tSet.values );
			return this;

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
