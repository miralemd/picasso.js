import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";

export default class Box {
	constructor( obj, composer ) {
		this.element = composer.element;

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		this.settings = obj.settings;
		this.data = composer.data;
		this.obj = obj;

		this.min = this.settings.min ? composer.scales[this.settings.min.scale] : null;
		this.max = this.settings.max ? composer.scales[this.settings.max.scale] : null;
		this.q2 = this.settings.q2 ? composer.scales[this.settings.q2.scale] : null;
		this.q3 = this.settings.q3 ? composer.scales[this.settings.q3.scale] : null;
		this.med = this.settings.med ? composer.scales[this.settings.med.scale] : null;

		//this.scales = this.settings.scales.map( s => composer.scales[s.scale] );

		Object.keys( this.settings.styles ).forEach( key => {
			this.settings.styles[key].compiled = this.compileStyle( this.settings.styles[key] );
		} );

		this.onData();
	}

	onData() {
		this.boxes = [];

		this.data.dataPages().then( ( pages ) => {

			pages.forEach( ( page, i ) => {
				const min = this.min ? this.data.fromSource( this.min.source, i ) : null,
					max = this.max ? this.data.fromSource( this.max.source, i ) : null,
					q2 = this.q2 ? this.data.fromSource( this.q2.source, i ) : null,
					q3 = this.q3 ? this.data.fromSource( this.q3.source, i ) : null,
					med = this.med ? this.data.fromSource( this.med.source, i ) : null;

				this.data.fromSource( this.obj.data.source, i ).forEach( ( value, row ) => {
					this.boxes.push( {
						min: min ? ( 1 - this.min.toValue( min, row ) ) : 0.5,
						max: max ? ( 1 - this.max.toValue( max, row ) ) : 0.5,
						q2: q2 ? ( 1 - this.q2.toValue( q2, row ) ) : 0.5,
						q3: q3 ? ( 1 - this.q3.toValue( q3, row ) ) : 0.5,
						med: med ? ( 1 - this.med.toValue( med, row ) ) : 0.5,
					} );
				} );

				//this.boxes.length = Math.ceil( Math.random() * ( this.boxes.length ) );
			}, this );

			this.resize();
		} ).catch( () => {
			this.resize();
		} );
	}

	render( boxes ) {
		const { width, height } = this.renderer.rect;

		let displayBoxes = boxes.filter( item => {
				return [ item.min, item.q2, item.q3, item.max ].filter( v => Number.isNaN( v ) ).length !== 4;
			} );

		let draw = [];
		let boxWidth = this.settings.styles.box.width || ( width / displayBoxes.length ) * 0.75;

		let i = -0.5;
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
					y: lowest * height,
					height: ( highest - lowest ) * height,
					x: i / displayBoxes.length * width - ( boxWidth / 2 ),
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
					y1: item.q2 * height,
					x1: i / displayBoxes.length * width,
					y2: item.min * height,
					x2: i / displayBoxes.length * width,
					style: this.settings.styles.low.compiled
				} );

				// Draw the box
				draw.push( {
					type: "rect",
					y: item.q3 * height,
					height: ( item.q2 - item.q3 ) * height,
					x: i / displayBoxes.length * width - ( boxWidth / 2 ),
					width: boxWidth,
					style: this.settings.styles.box.compiled
				} );

				// Draw the line q3 - max (high)
				draw.push( {
					type: "line",
					y1: item.max * height,
					x1: i / displayBoxes.length * width,
					y2: item.q3 * height,
					x2: i / displayBoxes.length * width,
					style: this.settings.styles.high.compiled
				} );
			}

			// The median line is drawn separately, and only if it's data exists
			if ( !Number.isNaN( item.med ) ) {
				draw.push( {
					type: "line",
					y1: item.med * height,
					x1: i / displayBoxes.length * width - ( boxWidth / 2 ),
					y2: item.med * height,
					x2: i / displayBoxes.length * width + ( boxWidth / 2 ),
					style: this.settings.styles.med.compiled
				} );
			}

		} );

		this.renderer.render( draw );
	}

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
