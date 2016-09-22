import { Dispersion } from "./generic/dispersion";

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

	render( items ) {
		// Filter out points we cannot render
		items = items.filter( item => {
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
