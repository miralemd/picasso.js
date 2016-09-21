import { economic } from "../palette/economic";
import { doodler } from "../palette/doodler";
import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";
import { transposer } from "../../transposer/transposer";

export default class Gantt extends economic {
	constructor( obj, composer ) {
		super( obj, composer );

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		// Set the default bandwidth
		this.bandwidth = 0;

		// Default to vertical on gantt
		if ( this.settings.vertical === undefined ) {
			this.settings.vertical = true;
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

		// Postfill settings instead of prefilling them if nonexistant
		doodle.postfill( "box", "width", boxWidth );

		let i = 0;
		boxes.forEach( item => {
			i++;

			doodle.customize( item );

			// Draw the box
			let high = Math.max( item.start, item.end );
			let low = Math.min( item.start, item.end );

			doodle.box(
				item.x,
				low,
				( high - low ),
				"box"
			);

			// Draw the median line
			if ( item.med !== null ) {
				doodle.median( item.x, item.med );
			}
		} );

		this.renderer.render( bp.output() );
	}
}

export function gantt( ...args ) {
	return new Gantt( ...args );
}
