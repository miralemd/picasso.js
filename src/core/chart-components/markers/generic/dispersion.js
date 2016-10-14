import { renderer } from "../../../renderer";
import { doodler } from "./doodler";
import { transposer } from "../../../transposer/transposer";

function values( table, setting ) {
	if ( setting && setting.source ) {
		return table.findField( setting.source ).values();
	}
	return null;
}

export class Dispersion {
	constructor( obj, composer ) {
		this.element = composer.container();

		// Setup the renderer
		this.renderer = renderer();
		this.renderer.appendTo( this.element );
		this.rect = { x: 0, y: 0, width: 0, height: 0 };

		// Setup settings and data
		this.settings = obj.settings;
		this.table = composer.table();
		this.obj = obj;

		// Setup scales
		this.x = this.settings.x ? composer.scale( this.settings.x ) : null;
		this.y = this.settings.y ? composer.scale( this.settings.y ) : null;

		// Set the default bandwidth
		this.bandwidth = 0;

		// Initialize blueprint and doodler
		this.blueprint = transposer();
		this.doodle = doodler();
	}

	onData() {
		this.items = [];

		let data = values( this.table, this.obj.data );
		let startValues = values( this.table, this.settings.start );
		let endValues = values( this.table, this.settings.end );
		let minValues = values( this.table, this.settings.min );
		let maxValues = values( this.table, this.settings.max );
		let medValues = values( this.table, this.settings.med );

		let x = this.x;
		let y = this.y;

		this.bandwidth = x ? x.scale.step() * 0.75 : 0.5;

		data.forEach( ( d, i ) => {
			this.items.push( {
				x: x ? x( d ) : 0.5,
				min: y && minValues ? y( minValues[i] ) : null,
				max: y && maxValues ? y( maxValues[i] ) : null,
				start: y && startValues ? y( startValues[i] ) : 0,
				end: y && endValues ? y( endValues[i] ) : null,
				med: y && medValues ? y( medValues[i] ) : null
			} );
		} );
	}

	render() {
		// Setup the blueprint
		this.blueprint.width = this.rect.width;
		this.blueprint.height = this.rect.height;
		this.blueprint.x = this.rect.x;
		this.blueprint.y = this.rect.y;
		this.blueprint.vertical = this.settings.vertical;

		// Setup the doodler
		this.doodle.push = item => this.blueprint.push( item );
		this.doodle.settings = this.settings;

		// Calculate box width
		const boxWidth = Math.max( 5, Math.min( 100, this.bandwidth * this.blueprint.width ) ) / this.blueprint.width;
		const whiskerWidth = boxWidth * 0.5;

		// Postfill settings instead of prefilling them if nonexistant
		this.doodle.postfill( "box", "width", boxWidth );
		this.doodle.postfill( "whisker", "width", whiskerWidth );

		this.items.forEach( item => {
			this.doodle.customize( item );
			this.renderDataPoint( item );
		} );

		this.renderer.render( this.blueprint.output() );
	}

	renderDataPoint( item ) {
		return item;
	}

	resize( rect ) {
		this.rect = rect;
	}

	remap( input, output ) {
		this.settings[output] = this.settings[input];
		delete this.settings[input];
	}
}
