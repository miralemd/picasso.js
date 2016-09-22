import { renderer } from "../../../renderer";
import { doodler } from "./doodler";
import { transposer } from "../../../transposer/transposer";

export class dispersion {
	constructor( obj, composer ) {
		this.element = composer.element;

		// Setup the renderer
		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		// Setup settings and data
		this.settings = obj.settings;
		this.data = composer.data;
		this.obj = obj;

		// Setup scales
		this.x = composer.scales[this.settings.x.scale];
		this.y = composer.scales[this.settings.y.scale];

		// Set the default bandwidth
		this.bandwidth = 0;

		// Initialize blueprint and doodler
		this.blueprint = transposer();
		this.doodle = doodler();
	}

	onData() {
		this.items = [];

		this.data.dataPages().then( ( pages ) => {

			pages.forEach( ( page, i ) => {
				const x = this.x ? this.data.fromSource( this.x.source, i ) : null,
					min = this.settings.min ? this.data.fromSource( this.settings.min.source, i ) : null,
					max = this.settings.max ? this.data.fromSource( this.settings.max.source, i ) : null,
					start = this.settings.start ? this.data.fromSource( this.settings.start.source, i ) : null,
					end = this.settings.end ? this.data.fromSource( this.settings.end.source, i ) : null,
					med = this.settings.med ? this.data.fromSource( this.settings.med.source, i ) : null;

				this.bandwidth = this.x.scale.step() * 0.75;

				this.data.fromSource( this.obj.data.source, i ).forEach( ( value, row ) => {
					this.items.push( {
						x: x ? ( this.x.scale.get( row ) ) : 0.5,
						min: min ? ( this.y.toValue( min, row ) ) : null,
						max: max ? ( this.y.toValue( max, row ) ) : null,
						start: start ? ( this.y.toValue( start, row ) ) : 0,
						end: end ? ( this.y.toValue( end, row ) ) : null,
						med: med ? ( this.y.toValue( med, row ) ) : null
					} );
				} );
			}, this );

			this.resize();
		} ).catch( () => {
			this.resize();
		} );
	}

	render( items ) {
		// Setup the blueprint
		this.blueprint.width = this.renderer.rect.width;
		this.blueprint.height = this.renderer.rect.height;
		this.blueprint.vertical = this.settings.vertical;

		// Setup the doodler
		this.doodle.push = item => this.blueprint.push( item );
		this.doodle.settings = this.settings;

		// Calculate box width
		let boxWidth = Math.max( 5, Math.min( 100, this.bandwidth * this.blueprint.width ) ) / this.blueprint.width;
		let whiskerWidth = boxWidth * 0.5;

		// Postfill settings instead of prefilling them if nonexistant
		this.doodle.postfill( "box", "width", boxWidth );
		this.doodle.postfill( "whisker", "width", whiskerWidth );

		items.forEach( item => {
			this.doodle.customize( item );
			this.renderDataPoint( item );
		} );

		this.renderer.render( this.blueprint.output() );
	}

	renderDataPoint( item ) {
		return item;
	}

	resize() {
		this.renderer.rect.width = this.element.clientWidth;
		this.renderer.rect.height = this.element.clientHeight;

		this.render( this.items );
	}

	remap( input, output ) {
		this.settings[output] = this.settings[input];
		delete this.settings[input];
	}
}
