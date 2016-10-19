import { looseDistanceBasedGenerator, tightDistanceBasedGenerator } from "../../scales/linear";

function hasMinMaxValue( settings ) {
	return settings.ticks.min !== undefined || settings.ticks.max !== undefined;
}

function ticksByCount( { count, minorCount, scale, formatter } ) {
	return scale._scale.ticks( ( ( count - 1 ) * minorCount ) + count ).map( ( tick, i ) => {
		return {
			position: scale.get( tick ),
			label: formatter( tick ),
			isMinor: i % ( minorCount + 1 ) !== 0
		};
	} );
}

function ticksByValue( { values, scale, formatter } ) {
	return values.map( ( tick ) => {
		return {
			position: scale.get( tick ),
			label: formatter( tick ),
			isMinor: false
		};
	} );
}

function forceTicksAtBounds( ticks, scale, formatter ) {
	// let bounds = [];
	let ticksP = ticks.map( t => t.position );

	if ( ticksP.indexOf( 0 ) === -1 ) {
		ticks.splice( 0, 0, {
			position: 0,
			label: formatter( scale.start() ),
			isMinor: false
		} );
	}

	if ( ticksP.indexOf( 1 ) === -1 ) {
		ticks.push( {
			position: 1,
			label: formatter( scale.end() ),
			isMinor: false
		} );
	}
}

export function generateContinuousTicks( { settings, scale, innerRect, formatter } ) {
	let ticks;
	const minorCount = settings.minorTicks && settings.minorTicks.show ? settings.minorTicks.count : 0;

	if ( settings.ticks.values ) {
		// TODO With custom tick values, dont care if its within the domain?
		scale.tickGenerator( ticksByValue );
		ticks = scale.ticks( { values: settings.ticks.values, scale, formatter } );
	} else if ( settings.ticks.count !== undefined ) {
		scale.tickGenerator( ticksByCount );
		ticks = scale.ticks( { count: settings.ticks.count, minorCount, scale, formatter } );
	} else {
		let distance = settings.align === "top" || settings.align === "bottom" ? innerRect.width : innerRect.height;
		scale.tickGenerator( settings.ticks.tight && !hasMinMaxValue( settings ) ? tightDistanceBasedGenerator : looseDistanceBasedGenerator );
		ticks = scale.ticks( {
			distance: distance,
			minorCount: minorCount,
			start: scale.start(),
			end: scale.end(),
			formatter
		} );

		if ( settings.ticks.tight && !hasMinMaxValue( settings ) ) {
			scale.domain( [ticks[0].label, ticks[ticks.length - 1].label ] );
		}

		if ( settings.ticks.forceBounds ) {
			forceTicksAtBounds( ticks, scale, formatter );
		}
	}

	return ticks;
}

export function generateDiscreteTicks( { data, scale } ) {
	return data.map( ( d, i ) => {
		let p0 = scale.get( i );
		let p = p0 !== undefined ? p0 : scale.get( d );
		return {
			position: p,
			label: d
		};
	} );
}
