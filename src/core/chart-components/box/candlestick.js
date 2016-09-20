import { economic } from "../palette/economic";
import { doodler } from "../palette/doodler";
import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";
import { transposer } from "../../transposer/transposer";

export default class Candlestick extends economic {
	constructor( obj, composer ) {
		super( obj, composer );

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		// Set the default bandwidth
		this.bandwidth = 0;

		this.onData();
	}

	onData() {
		this.bandwidth = this.x.scale.step() * 0.75;

		super.onData();
	}

	render( boxes ) {
		boxes = boxes.filter( item => {
			return [ item.min, item.max ].indexOf( null ) === -1 || [ item.start, item.end ].indexOf( null ) === -1;
		} );

		// Setup the transposer
		let draw = transposer();

		draw.width = this.renderer.rect.width;
		draw.height = this.renderer.rect.height;

		draw.vertical = this.settings.vertical;

		// Setup the doodler and link it to the transposer
		let doodle = doodler( item => draw.push( item ), this.settings );

		// Calculate box width
		let boxWidth = Math.max( 5, Math.min( 100, this.bandwidth * draw.width ) ) / draw.width;
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
				// Draw the line min - start
				doodle.verticalLine( item.x, item.start, item.min, "line" );

				// Draw the line end - max (high)
				doodle.verticalLine( item.x, item.max, item.end, "line" );
			}

			// Draw the box
			let high = Math.max( item.start, item.end );
			let low = Math.min( item.start, item.end );

			let uptrend = item.start < item.end;

			doodle.box(
				item.x,
				low,
				( high - low ),
				uptrend ? "upbox" : "downbox"
			);

			// Draw the whiskers
			if ( this.settings.whiskers && item.min !== null && item.max !== null )
			{
				// Low whisker
				doodle.whisker( item.x, item.min );

				// High whisker
				doodle.whisker( item.x, item.max );
			}

			// Draw the median line
			if ( item.med !== null ) {
				doodle.median( item.x, item.med );
			}
		} );

		this.renderer.render( draw.output() );
	}
}

export function candlestick( obj, composer ) {
	return new Candlestick( obj, composer );
}
