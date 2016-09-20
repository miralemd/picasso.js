import { economic } from "../palette/economic";
import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";
import { transposer } from "../../transposer/transposer";

export default class Box extends economic {
	constructor( obj, composer ) {
		super( obj, composer );

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		// Set the default bandwidth
		this.bandwidth = 0;

		// Select a mode
		this.mode = "normal";
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

	onData() {
		this.bandwidth = this.x.scale.step() * 0.75;

		super.onData();
	}

	render( boxes ) {
		boxes = boxes.filter( item => {
			return [ item.min, item.max ].indexOf( null ) === -1 || [ item.start, item.end ].indexOf( null ) === -1;
		} );

		let draw = transposer();

		draw.width = this.renderer.rect.width;
		draw.height = this.renderer.rect.height;

		draw.vertical = this.settings.vertical;

		let boxWidth = Math.max( 5, Math.min( 100, this.bandwidth * draw.width ) ) / draw.width;
		let whiskerWidth = boxWidth * 0.5;
		let ohlcWhiskerWidth = boxWidth * 0.5;

		let single = false;

		let i = 0;
		boxes.forEach( item => {
			i++;

			single = item.start === null || item.end === null || this.mode === "ohlc";

			// Single line from min to max, no box.
			if ( single )
			{
				// Draw the line min - max
				draw.push( {
					type: "line",
					y1: item.max,
					x1: item.x,
					y2: item.min,
					x2: item.x,
					stroke: "#000"
				} );
			}
			else
			{
				if ( item.min !== null && item.max !== null )
				{
					// Draw the line min - start
					draw.push( {
						type: "line",
						y1: item.start,
						x1: item.x,
						y2: item.min,
						x2: item.x,
						stroke: "#000"
					} );

					// Draw the line end - max (high)
					draw.push( {
						type: "line",
						y1: item.max,
						x1: item.x,
						y2: item.end,
						x2: item.x,
						stroke: "#000"
					} );
				}

				let high = Math.max( item.start, item.end );
				let low = Math.min( item.start, item.end );

				let uptrend = item.start < item.end;

				// Draw the box
				draw.push( {
					type: "rect",
					x: item.x - ( boxWidth / 2 ),
					y: low,
					height: ( high - low ),
					width: boxWidth,
					fill: uptrend ? "#0f0" : "#f00",
					stroke: "#000"
				} );
			}

			// Draw OHLC instead of box
			if ( this.mode === "ohlc" )
			{
				// Open whisker
				draw.push( {
					type: "line",
					y1: item.start,
					x1: item.x - ohlcWhiskerWidth,
					y2: item.start,
					x2: item.x
				} );

				// Close whisker
				draw.push( {
					type: "line",
					y1: item.end,
					x1: item.x,
					y2: item.end,
					x2: item.x + ohlcWhiskerWidth
				} );
			}

			// Draw the whiskers
			if ( this.settings.whiskers && item.min !== null && item.max !== null )
			{
				// Low whisker
				draw.push( {
					type: "line",
					y1: item.min,
					x1: item.x - ( whiskerWidth / 2 ),
					y2: item.min,
					x2: item.x + ( whiskerWidth / 2 ),
					stroke: "#000"
				} );

				// High whisker
				draw.push( {
					type: "line",
					y1: item.max,
					x1: item.x - ( whiskerWidth / 2 ),
					y2: item.max,
					x2: item.x + ( whiskerWidth / 2 ),
					stroke: "#000"
				} );
			}

			// Draw the median line
			if ( item.med !== null && this.mode !== "ohlc" ) {
				draw.push( {
					type: "line",
					y1: item.med,
					x1: item.x - ( boxWidth / 2 ),
					y2: item.med,
					x2: item.x + ( boxWidth / 2 ),
					stroke: "#000"
				} );
			}
		} );

		this.renderer.render( draw.output() );
	}
}

export function box( obj, composer ) {
	return new Box( obj, composer );
}
