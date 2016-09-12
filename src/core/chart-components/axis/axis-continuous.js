import { Axis } from "./axis";
import { linear } from "../../scales/linear";
import { AxisHelpers as helpers } from "./axis-helpers";

export default class AxisContinuous extends Axis {
	constructor( axisConfig, composer, renderer ) {
		super( axisConfig, composer, renderer );
		this._minorTicksCount = 0; // Should be set by renderer based on amount of space available and/or use config to toggle on of as option
		this._ticksCountScale = linear().domain( [0, 100] ).range( [0, 1] );

		this.settings( axisConfig.settings );
		this.render();
	}

	settings( opt ) {
		this._settings = {
			title: {
				// value: "Custom title",
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
					size: 8, // TODO unify format for size
					color: "#999",
					thickness: 1
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

	format() {
		if ( this._settings.labels.format ) {
			this._formatter = this._settings.labels.format || "s";
		}
		return this;
	}

	ticksValue( values ){
		return values.map( ( tick ) => {
			return {
				position: this.scale.get( tick ),
				label: tick,
				isMinor: false
			};
		} );
	}

	extendDomain() {
		const min = this._settings.ticks.min,
			max = this._settings.ticks.max,
			start = this.scale.start(),
			end = this.scale.end(),
			minSafe = min !== undefined,
			maxSafe = max !== undefined;

		if ( minSafe || maxSafe ) {
			const d = [ minSafe ? min : start, maxSafe ? max : end ];
			this.scale.domain( d );
		} else if ( start === 0 && end === 0 ) {
			this.scale.domain( [-10, 10] );
		} else if ( start === end ) {
			this.scale.domain( [start * 0.9, end * 1.1] );
		}

		if ( this._settings.ticks.clamp ) {
			const niceVal = start > 1 && end > 1 ? 2 : 10;
			this.scale.nice( niceVal ); // TODO scale with data granularity
		}

		return this;
	}

	ticks() {
		let count = 0;
		const minorCount = this._settings.minorTicks.show ? this._settings.minorTicks.count : 0;

		if ( this._settings.ticks.values ) {
			// TODO With custom tick values, dont care if its within the domain?
			return this.ticksValue( this._settings.ticks.values );
		} else if ( this._settings.ticks.count !== undefined ) {
			count = this._settings.ticks.count;
		} else {
			if ( this._dock === "top" || this._dock === "bottom" ) {
				count = Math.max( this._ticksCountScale.get( this.rect.width - this.rect.x ), 2 );
			} else {
				count = Math.max( this._ticksCountScale.get( this.rect.height - this.rect.y ), 2 );
			}
		}

		let ticks = this.scale.ticks( ( ( count - 1 ) * minorCount ) + count );
		const ticksFormatted = ticks.map( this.scale.tickFormat( count, this._formatter ) );

		return ticksFormatted.map( ( tick, i ) => {
			return {
				position: this.scale.get( ticks[i] ),
				label: tick,
				isMinor: i % ( minorCount + 1 ) !== 0
			};
		} );
	}

	onData() {
		this.extendDomain();
		this.format();
		this._ticks = this.ticks();

		return this;
	}
}

export function axisContinuous( ...a ) {
	return new AxisContinuous( ...a );
}
