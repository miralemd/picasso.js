import { economic } from "../palette/economic";
import { doodler } from "../palette/doodler";
import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";
import { transposer } from "../../transposer/transposer";

export default class Bar extends economic {
	constructor( obj, composer ) {
		super( obj, composer );

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		// Set the default bandwidth
		this.bandwidth = 0;

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

		boxes.forEach( item => {
			doodle.customize( item );

			doodle.box(
				item.x,
				0,
				item.end,
				"box"
			);
		} );

		this.renderer.render( bp.output() );
	}
}

export function bar( ...args ) {
	return new Bar( ...args );
}
