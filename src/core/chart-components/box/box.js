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

		this.x = composer.scales[this.settings.x.scale];
		this.y = composer.scales[this.settings.y.scale];

		// Tilt the boxplot
		this.flipXY = this.settings.flipXY;

		// rendering settings
		this.rsettings = {
			bandwidth: 0
		};

		// Compile all styles
		[ "low", "box", "high", "med" ].forEach( key => {
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
		this.rsettings.bandwidth = this.x.scale.step() * 0.75;

		this.data.dataPages().then( ( pages ) => {

			pages.forEach( ( page, i ) => {
				const x = this.x ? this.data.fromSource( this.x.source, i ) : null,
					min = this.data.fromSource( this.settings.min.source, i ),
					max = this.data.fromSource( this.settings.max.source, i ),
					q2 = this.data.fromSource( this.settings.q2.source, i ),
					q3 = this.data.fromSource( this.settings.q3.source, i ),
					med = this.data.fromSource( this.settings.med.source, i );

				this.data.fromSource( this.obj.data.source, i ).forEach( ( value, row ) => {
					this.boxes.push( {
						x: x ? ( this.x.scale.get( row ) ) : 0.5,
						min: min ? ( this.negateCoordinates( this.y.toValue( min, row ) ) ) : 0.5,
						max: max ? ( this.negateCoordinates( this.y.toValue( max, row ) ) ) : 0.5,
						q2: q2 ? ( this.negateCoordinates( this.y.toValue( q2, row ) ) ) : 0.5,
						q3: q3 ? ( this.negateCoordinates( this.y.toValue( q3, row ) ) ) : 0.5,
						med: med ? ( this.negateCoordinates( this.y.toValue( med, row ) ) ) : 0.5
					} );
				} );
			}, this );

			this.resize();
		} ).catch( () => {
			this.resize();
		} );
	}

	render( boxes ) {
		let displayBoxes = boxes.filter( item => {
			// If all values are NaN ignore the item
			return [
				item.min, item.q2, item.q3, item.max
			].filter( v => Number.isNaN( v ) ).length !== 4;
		} );

		let draw = boxPrerend();

		draw.width = this.renderer.rect.width;
		draw.height = this.renderer.rect.height;
		draw.flipXY = this.flipXY; // this must be set after setting w/h but before draw

		let boxWidth = Math.max( 5, Math.min( 100, this.rsettings.bandwidth * draw.width ) );

		let i = 0;
		displayBoxes.forEach( item => {
			i++;
			let vals = [ item.min, item.q2, item.q3, item.max ];

			// Don't draw anything without enough data
			if ( vals.filter( v => Number.isNaN( v ) ).length > 1 )
			{
				return;
			}

			// Draw a speculative indication box of the highest and lowest values
			if ( vals.filter( v => Number.isNaN( v ) ).length )
			{
				let lowest = Math.min( ...vals.filter( v => !Number.isNaN( v ) ) );
				let highest = Math.max( ...vals.filter( v => !Number.isNaN( v ) ) );

				// Draw the box
				draw.push( {
					type: "rect",
					y: lowest * draw.height,
					height: ( highest - lowest ) * draw.height,
					x: item.x * draw.width - ( boxWidth / 2 ),
					width: boxWidth,
					style: this.settings.styles.box.compiled
				} );
			}
			else
			{
				// Normal rendering

				// Draw the line min - q2
				draw.push( {
					type: "line",
					y1: item.q2 * draw.height,
					x1: item.x * draw.width,
					y2: item.min * draw.height,
					x2: item.x * draw.width,
					style: this.settings.styles.low.compiled
				} );

				// Draw the box
				draw.push( {
					type: "rect",
					y: ( draw.flipXY ? item.q2 : item.q3 ) * draw.height,
					height: ( draw.flipXY ? item.q3 - item.q2 : item.q2 - item.q3 ) * draw.height,
					x: item.x * draw.width - ( boxWidth / 2 ),
					width: boxWidth,
					style: this.settings.styles.box.compiled
				} );

				// Draw the line q3 - max (high)
				draw.push( {
					type: "line",
					y1: item.max * draw.height,
					x1: item.x * draw.width,
					y2: item.q3 * draw.height,
					x2: item.x * draw.width,
					style: this.settings.styles.high.compiled
				} );
			}

			// The median line is drawn separately, and only if it's data exists
			if ( !Number.isNaN( item.med ) ) {
				draw.push( {
					type: "line",
					y1: item.med * draw.height,
					x1: item.x * draw.width - ( boxWidth / 2 ),
					y2: item.med * draw.height,
					x2: item.x * draw.width + ( boxWidth / 2 ),
					style: this.settings.styles.med.compiled
				} );
			}
		} );

		this.renderer.render( draw );
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
}

export function box( obj, composer ) {
	return new Box( obj, composer );
}
