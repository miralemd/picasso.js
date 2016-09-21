import { economic } from "../palette/economic";
import { doodler } from "../palette/doodler";
import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";
import { transposer } from "../../transposer/transposer";

export default class OHLC extends economic {
	constructor( obj, composer ) {
		super( obj, composer );

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		// Set the default bandwidth
		this.bandwidth = 0;

		// This must be done because the "economic" class base only supports
		// start, min, med, max, and end measures.
		if ( this.settings.open && this.settings.high && this.settings.low && this.settings.close )
		{
			this.mode = "ohlc";
			this.settings.whiskers = false;

			this.remap( "open", "start" );
			this.remap( "high", "max" );
			this.remap( "low", "min" );
			this.remap( "close", "end" );
		}

		this.onData();
	}

	render( boxes, bp = transposer(), doodle = doodler() ) {
		this.bandwidth = this.x.scale.step() * 0.75;

		boxes = boxes.filter( item => {
			return [ item.min, item.max ].indexOf( null ) === -1 || [ item.start, item.end ].indexOf( null ) === -1;
		} );

		// Setup the blueprint
		bp.width = this.renderer.rect.width;
		bp.height = this.renderer.rect.height;
		bp.vertical = this.settings.vertical;

		// Setup the doodler
		doodle.push = item => bp.push( item );
		doodle.settings = this.settings;

		// Calculate box width
		let boxWidth = Math.max( 5, Math.min( 100, this.bandwidth * bp.width ) ) / bp.width;
		let whiskerWidth = boxWidth * 0.5;

		// Postfill settings instead of prefilling them if nonexistant
		doodle.postfill( "box", "width", boxWidth );
		doodle.postfill( "whisker", "width", whiskerWidth );

		let i = 0;
		boxes.forEach( item => {
			i++;

			doodle.customize( item );

			if ( item.min !== null && item.max !== null )
			{
				// Draw the line end - max (high)
				doodle.verticalLine( item.x, item.max, item.min, "line" );
			}

			doodle.openwhisker( item.x, item.start );
			doodle.closewhisker( item.x, item.end );

			// Draw the median line
			if ( item.med !== null ) {
				doodle.median( item.x, item.med );
			}
		} );

		this.renderer.render( bp.output() );
	}
}

export function ohlc( ...args ) {
	return new OHLC( ...args );
}
