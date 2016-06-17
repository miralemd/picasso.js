import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";

export default class Point {
	constructor( obj, composer ) {
		this.element = composer.element;

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		this.settings = obj.settings;
		this.data = composer.data;

		this.x = composer.scales[this.settings.x.scale];
		this.y = composer.scales[this.settings.y.scale];
		this.size = composer.scales[this.settings.size.scale];

		this.onData();
	}

	onData() {
		this.points = [];
		for ( let i = 0; i < 10; i++ ) {
			this.points.push( {
				x: this.x.get( Math.random() ),
				y: this.y.get( Math.random() ),
				size: this.size.get( Math.random() ),
				fill: this.settings.fill || "#aaa"
			} );
		}
		this.resize();
	}

	render( points ) {
		let { width, height } = this.renderer.rect,
			displayPoints = points.map( p => {
				return {
					type: "circle",
					cx: p.x * width,
					cy: p.y * height,
					r: p.size * 20,
					fill: p.fill
				};
			} );

		this.renderer.render( displayPoints );
	}

	resize() {
		this.renderer.rect.width = this.element.clientWidth;
		this.renderer.rect.height = this.element.clientHeight;
		this.render( this.points );
	}
}

export function point( obj, composer ) {
	return new Point( obj, composer );
}
