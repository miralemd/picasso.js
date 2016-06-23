import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";

export default class Point {
	constructor( obj, composer ) {
		this.element = composer.element;

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		this.settings = obj.settings;
		this.data = composer.data;
		this.obj = obj;

		this.x = this.settings.x ? composer.scales[this.settings.x.scale] : null;
		this.y = this.settings.y ? composer.scales[this.settings.y.scale] : null;
		this.size = this.settings.size ? composer.scales[this.settings.size.scale] : null;

		this.onData();
	}

	onData() {
		this.points = [];

		this.data.dataPages().then( ( pages ) => {
			pages.forEach( ( page, i ) => {
				let x = this.x ? this.data.fromSource( this.x.source, i ) : null;
				let y = this.y ? this.data.fromSource( this.y.source, i ) : null;
				let size = this.size ? this.data.fromSource( this.size.source, i ) : null;
				this.data.fromSource( this.obj.data.source, i ).forEach( ( value, row ) => {
					this.points.push( {
						x: x ? this.x.toValue( x, row ) : 0.5,
						y: y ? ( 1 - this.y.toValue( y, row ) ) : 0.5,
						size: size ? this.size.toValue( size, row ) : 0.5,
						fill: this.settings.fill || "#aaa"
					} );
				} );
			}, this );
			this.resize();
		} ).catch( () => {
			this.resize();
		} );
	}

	render( points ) {
		let size = 5,
			{ width, height } = this.renderer.rect,
			margin = {
				left: size,
				right: size,
				top: size,
				bottom: size
			},
			displayPoints = points.filter( p => {
				return !isNaN( p.x + p.y + p.size );
			} ).map( p => {
				return {
					type: "circle",
					cx: margin.left + p.x * ( width - margin.left - margin.right ),
					cy: margin.top + p.y * ( height - margin.top - margin.bottom ),
					r: 5 + 0.5 * p.size * ( size - 5 ),
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
