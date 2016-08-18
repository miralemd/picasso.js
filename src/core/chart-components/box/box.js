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

		this.onData();
	}

	onData() {
		this.boxes = [];

		this.data.dataPages().then( ( pages ) => {
			/*eslint no-unused-expressions: 0*/
			this.min && this.min.update();
			this.max && this.max.update();

			pages.forEach( ( page, i ) => {
				const min = this.min ? this.data.fromSource( this.min.source, i ) : null,
					max = this.max ? this.data.fromSource( this.max.source, i ) : null,
					q2 = this.q2 ? this.data.fromSource( this.q2.source, i ) : null,
					q3 = this.q3 ? this.data.fromSource( this.q3.source, i ) : null,
					med = this.med ? this.data.fromSource( this.med.source, i ) : null;

				this.data.fromSource( this.obj.data.source, i ).forEach( ( value, row ) => {
					this.boxes.push( {
						min: min ? this.min.toValue( min, row ) : 0.5,
						max: max ? ( this.max.toValue( max, row ) ) : 0.5,
						q2: q2 ? ( this.q2.toValue( q2, row ) ) : 0.5,
						q3: q3 ? ( this.q3.toValue( q3, row ) ) : 0.5,
						med: med ? ( this.med.toValue( med, row ) ) : 0.5,
					} );
				} );

				//console.log( this.boxes );
			}, this );
			this.resize();
		} ).catch( () => {
			this.resize();
		} );
	}

	render( boxes ) {

		const { width, height } = this.renderer.rect;
		let displayBoxes = boxes.filter( item => {
				return !isNaN( item.min + item.max );
			} );

		let draw = [];
		let i = -0.5;
		displayBoxes.forEach( item => {
			i++;

			// Draw the line min - q2
			draw.push( {
				type: "line",
				y1: item.q2 * height,
				x1: i / displayBoxes.length * width,
				y2: Math.min( item.min * height, item.q2 * height - 1 ),
				x2: i / displayBoxes.length * width,
				style: "stroke: rgb(0, 0, 0); stroke-width: 2"
			} );

			// Draw the line q3 - max
			draw.push( {
				type: "line",
				y1: item.max * height,
				x1: i / displayBoxes.length * width,
				y2: Math.min( item.q3 * height, item.max * height - 1 ),
				x2: i / displayBoxes.length * width,
				style: "stroke: rgb(0, 0, 0); stroke-width: 2"
			} );

			// Draw the box
			draw.push( {
				type: "rect",
				y: item.q2 * height,
				height: ( item.q3 - item.q2 ) * height,
				x: i / displayBoxes.length * width - 10,
				width: 20,
				fill: "rgb(255, 255, 255)",
				style: "stroke-width: 2; stroke: rgb(0, 0, 0)"
			} );

			// Draw the line for med
			draw.push( {
				type: "line",
				y1: item.med * height,
				x1: i / displayBoxes.length * width - 10,
				y2: item.med * height,
				x2: i / displayBoxes.length * width + 10,
				style: "stroke: rgb(0, 0, 0); stroke-width: 2"
			} );

		} );

		this.renderer.render( draw );
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
