import { Dispersion } from "./generic/dispersion";

/**
 * @typedef marker-box
 * @property {string} type - "box"
 * @property {data-ref} data - Box data
 * @property {marker-box-settings} settings - Box marker settings
 * @example
 * {
 * 	type: "box",
 * 	data: { source: "/qDimensionInfo/0" },
 *	settings: {
 *		x: { source: "/qDimensionInfo/0" },
 *		y: { source: ["/qMeasureInfo/0", "/qMeasureInfo/1", "/qMeasureInfo/2", "/qMeasureInfo/3", "/qMeasureInfo/4"] },
 *		min: { source: "/qMeasureInfo/0" },
 *		max: { source: "/qMeasureInfo/1" },
 *		start: { source: "/qMeasureInfo/2" },
 *		end: { source: "/qMeasureInfo/3" },
 *		med: { source: "/qMeasureInfo/4" }
 *	}
 * }
 */

/**
 * @typedef marker-box-settings
 * @property {marker-box-data} min - min
 * @property {marker-box-data} max - max
 * @property {marker-box-data} start - start
 * @property {marker-box-data} end - end
 * @property {marker-box-data} med - med
 */

/**
 * @typedef marker-box-data
 */

export default class Box extends Dispersion {
	constructor( obj, composer ) {
		super( obj, composer );

		// Default to vertical
		if ( this.settings.vertical === undefined ) {
			this.settings.vertical = true;
		}

		// Default to show whiskers
		if ( this.settings.whiskers === undefined ) {
			this.settings.whiskers = true;
		}

		this.onData(); // to be removed?
	}

	render() {
		// Filter out points we cannot render
		let items = this.items.filter( item => {
			return [ item.min, item.max ].indexOf( null ) === -1 || [ item.start, item.end ].indexOf( null ) === -1;
		} );

		super.render( items );
	}

	renderDataPoint( item ) {
		if ( item.min !== null && item.max !== null )
		{
			// Draw the line min - start
			this.doodle.verticalLine( item.x, item.start, item.min, "line" );

			// Draw the line end - max (high)
			this.doodle.verticalLine( item.x, item.max, item.end, "line" );
		}

		// Draw the box
		const high = Math.max( item.start, item.end );
		const low = Math.min( item.start, item.end );

		this.doodle.box(
			item.x,
			low,
			( high - low ),
			"box"
		);

		// Draw the whiskers
		if ( this.settings.whiskers && item.min !== null && item.max !== null ) {
			// Low whisker
			this.doodle.whisker( item.x, item.min );

			// High whisker
			this.doodle.whisker( item.x, item.max );
		}

		// Draw the median line
		if ( item.med !== null ) {
			this.doodle.median( item.x, item.med );
		}
	}
}

export function box( ...args ) {
	return new Box( ...args );
}
