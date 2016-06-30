import { default as Label } from "./label";
import { default as ticker } from "../scales/ticks";

function innerRepresentationFn( axis, count, index, tick ) {
	const label = new Label( "" );

	if ( axis.isVertical ) {
		label.rect.y = axis.scale.get( tick ) * axis.rect.height;
	} else {
		label.rect.x = axis.scale.get( tick ) * axis.rect.width;
	}
	return label;
}

function outerRepresentationFn( axis, count, index, tick ) {
	const label = new Label();
	const formatter = axis.scale.tickFormat( count, "s" );
	const ticksFormatted = axis._ticks.map( formatter );
	label.representation = ticksFormatted[index];

	if ( axis.isVertical ) {
		label.rect.y = axis.scale.get( tick ) * axis.rect.height;
	} else {
		label.rect.x = axis.scale.get( tick ) * axis.rect.width;
	}

	return label;
}

function domainRepresentationFn( axis ){
	return {
		start: axis.scale.range()[0],
		end: axis.scale.range()[axis.scale.range().length - 1]
	};
}

function niceTicks( axis, count, nice ) {
	if ( nice && axis.scale.hasOwnProperty( "nice" ) ) {
		axis.scale.nice();
	}

	// const ticks = ticker.generateTicks( axis.scale.start(), axis.scale.end(), count, true ).ticks;
	const ticks = axis.scale.ticks( count );

	if ( nice && ticks.length > 1 ) {
		const start = ticks[0];
		const end = ticks[ticks.length - 1];
		axis.scale.domain( [start, end] );
	}

	console.log("ticks: ", ticks);
	console.log("domain after nice: ",axis.scale.domain());
	return ticks;
}

function generateMinorTicks( axis, start, end, count ) {
	return ticker.generateTicks( start, end, count, true ).ticks.map( t => {
		const tick = new Label( t );
		// const coord = axis.isVertical ? "y" : "x";
		// tick.rect[coord] = axis.scale.get( t );

		if ( axis.isVertical ) {
			tick.rect.y = axis.scale.get( t ) * axis.rect.height;
		} else {
			tick.rect.x = axis.scale.get( t ) * axis.rect.width;
		}

		return tick;
	} ).filter( ( t ) => {
		if ( start <= end ) {
			return t.representation > start && t.representation < end;
		}
		return t.representation < start && t.representation > end;
	} );
}

export default class AxisContinuous {
	constructor( scale ) {
		this.scale = scale;  // Copy scale instead? muteable issues?
		this.isVertical = false;
		this.rect = { width: 0, height: 0, x: 0, y: 0 };
		this._ticks = [];
		this._innerRepresentation = innerRepresentationFn;
		this._outerRepresentation = outerRepresentationFn;
		this._domainRepresentation = domainRepresentationFn;
		this._minorTicksCount = 4;
		// TODO Range must be continuous and numeric?
	}

	ticks( count, nice = true ) {
		this._ticks = niceTicks( this, count, nice );

		const ticksList = [];
		this._ticks.forEach( ( tick, i ) => {
			const tickObj = {
				inner: this._innerRepresentation( this, count, i, tick ),
				minor: generateMinorTicks( this, tick, this._ticks[ i + 1], this._minorTicksCount ),
				outer: this._outerRepresentation( this, count, i, tick )
			};
			ticksList.push( tickObj );
		} );
		return ticksList;
	}

	minorTicks( count = 0 ) {
		this._minorTicksCount = count;
		return this;
	}

	ticksInner( count, nice = true ){
		return this.ticks( count, nice ).map( t => t.inner );
	}

	ticksOuter( count, nice = true ){
		return this.ticks( count, nice ).map( t => t.outer );
	}

	innerRepresentation( fn ) {
		this._innerRepresentation = fn;
		return this;
	}

	outerRepresentation( fn ) {
		this._outerRepresentation = fn;
		return this;
	}

	domainRepresentation( fn ) {
		this._domainRepresentation = fn;
		return this;
	}

	domain() {
		return this._domainRepresentation( this );
	}
}

export function axisContinuous( ...a ) {
	return new AxisContinuous( ...a );
}
