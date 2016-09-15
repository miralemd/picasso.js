import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";
import { boxPrerend } from "./box-prerend";

export default class Box {
	constructor( obj, composer ) {
		this.element = composer.element;

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		this.settings = obj.settings;
		this.data = composer.data;
		this.obj = obj;

		// Setup scales
		this.x = composer.scales[this.settings.x.scale];
		this.y = composer.scales[this.settings.y.scale];

		// Tilt the boxplot
		this.flipXY = this.settings.flipXY;

		// Toggle whiskers
		this.whiskers = this.settings.whiskers;

		// Set the default bandwidth
		this.bandwidth = 0;

		// Select a mode
		this.mode = "normal";
		if ( this.settings.open && this.settings.high && this.settings.low && this.settings.close )
		{
			this.mode = "ohlc";
			this.whiskers = false;

			this.remap( "open", "start" );
			this.remap( "high", "max" );
			this.remap( "low", "min" );
			this.remap( "close", "end" );
		}

		// Compile all styles
		[ "low", "box", "high", "med", "single", "up", "down" ].forEach( key => {
			this.settings.styles[key] = this.settings.styles[key] || {};
			this.settings.styles[key].compiled = this.compileStyle(
				Object.assign( {}, this.settings.basestyle, this.settings.styles[key]
			) );
		} );

		this.onData();
	}

	// This negates the coordinates if the axis aren't flipped
	negateCoordinates( value ) {
		return this.flipXY ? value : 1 - value;
	}

	onData() {
		this.boxes = [];
		this.bandwidth = this.x.scale.step() * 0.75;

		this.data.dataPages().then( ( pages ) => {

			pages.forEach( ( page, i ) => {
				const x = this.x ? this.data.fromSource( this.x.source, i ) : null,
					min = this.settings.min ? this.data.fromSource( this.settings.min.source, i ) : null,
					max = this.settings.max ? this.data.fromSource( this.settings.max.source, i ) : null,
					start = this.settings.start ? this.data.fromSource( this.settings.start.source, i ) : null,
					end = this.settings.end ? this.data.fromSource( this.settings.end.source, i ) : null,
					med = this.settings.med ? this.data.fromSource( this.settings.med.source, i ) : null;

				this.data.fromSource( this.obj.data.source, i ).forEach( ( value, row ) => {
					this.boxes.push( {
						x: x ? ( this.x.scale.get( row ) ) : 0.5,
						min: min ? ( this.negateCoordinates( this.y.toValue( min, row ) ) ) : null,
						max: max ? ( this.negateCoordinates( this.y.toValue( max, row ) ) ) : null,
						start: start ? ( this.negateCoordinates( this.y.toValue( start, row ) ) ) : 0,
						end: end ? ( this.negateCoordinates( this.y.toValue( end, row ) ) ) : null,
						med: med ? ( this.negateCoordinates( this.y.toValue( med, row ) ) ) : null
					} );
				} );
			}, this );

			this.resize();
		} ).catch( () => {
			this.resize();
		} );
	}

	render( boxes ) {
		boxes = boxes.filter( item => {
			return [ item.min, item.max ].indexOf( null ) === -1 || [ item.start, item.end ].indexOf( null ) === -1;
		} );

		let draw = boxPrerend();

		draw.width = this.renderer.rect.width;
		draw.height = this.renderer.rect.height;

		draw.flipXY = this.flipXY;

		draw.noDecimals = true;

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
					x2: item.x
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
						stroke: "#f00"
					} );

					// Draw the line end - max (high)
					draw.push( {
						type: "line",
						y1: item.max,
						x1: item.x,
						y2: item.end,
						x2: item.x,
						stroke: "#0f0"
					} );
				}

				if ( item.start === 0 && !this.flipXY ) {
					item.start = 1;
				}

				let high = Math.max( item.start, item.end );
				let low = Math.min( item.start, item.end );

				// Draw the box
				draw.push( {
					type: "rect",
					y: low,
					height: ( high - low ),
					x: item.x - ( boxWidth / 2 ),
					width: boxWidth
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
			if ( this.whiskers && item.min !== null && item.max !== null )
			{
				// Low whisker
				draw.push( {
					type: "line",
					y1: item.min,
					x1: item.x - ( whiskerWidth / 2 ),
					y2: item.min,
					x2: item.x + ( whiskerWidth / 2 )
				} );

				// High whisker
				draw.push( {
					type: "line",
					y1: item.max,
					x1: item.x - ( whiskerWidth / 2 ),
					y2: item.max,
					x2: item.x + ( whiskerWidth / 2 )
				} );
			}

			// Draw the median line
			if ( item.med !== null && this.mode !== "ohlc" ) {
				draw.push( {
					type: "line",
					y1: item.med,
					x1: item.x - ( boxWidth / 2 ),
					y2: item.med,
					x2: item.x + ( boxWidth / 2 )
				} );
			}
		} );

		this.renderer.render( draw.output() );
	}

	// Compile styles into a CSS format
	compileStyle( props ) {
		return Object.keys( props ).map( key => {
			return key + ": " + props[key];
		} ).join( "; " );
	}

	resize() {
		this.renderer.rect.width = this.element.clientWidth;
		this.renderer.rect.height = this.element.clientHeight;

		this.render( this.boxes );
	}

	remap( input, output ) {
		this.settings[output] = this.settings[input];
		delete this.settings[input];
	}
}

export function box( obj, composer ) {
	return new Box( obj, composer );
}
