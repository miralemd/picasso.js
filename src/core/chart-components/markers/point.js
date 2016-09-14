import { renderer } from "../../renderer";

const DEFAULT_FILL = "#999";

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
		this.fill = typeof this.settings.fill === "string" ? this.settings.fill : this.settings.fill ? composer.scales[this.settings.fill.scale] : null;

		this.onData();
	}

	onData() {
		this.points = [];

		this.data.dataPages().then( ( pages ) => {
			/*eslint no-unused-expressions: 0*/
			this.x && this.x.update();
			this.y && this.y.update();
			this.size && this.size.update();
			pages.forEach( ( page, i ) => {
				const x = this.x ? this.data.fromSource( this.x.source, i ) : null,
					y = this.y ? this.data.fromSource( this.y.source, i ) : null,
					size = this.size ? this.data.fromSource( this.size.source, i ) : null,
					color = typeof this.fill === "string" ? this.fill : ( this.fill ? this.data.fromSource( this.fill.source, i ) : null );

				this.data.fromSource( this.obj.data.source, i ).forEach( ( value, row ) => {
					this.points.push( {
						x: x ? this.x.toValue( x, row ) : 0.5,
						y: y ? ( 1 - this.y.toValue( y, row ) ) : 0.5,
						size: size ? this.size.toValue( size, row ) : 0.5,
						title: `${value.qText} x:${x[row].qNum} y:${y[row].qNum}`,
						fill: typeof this.fill === "string" ? this.fill : ( color ? this.fill.toValue( color, row ) : DEFAULT_FILL )
					} );
				} );
			}, this );
			this.resize();
		} ).catch( () => {
			this.resize();
		} );
	}

	render( points ) {
		const numYValues = this.y && this.y.type === "ordinal" ? this.y.scale.domain().length : -1,
			//numXValues = this.x && this.x.type === "ordinal" ? this.x.scale.domain().length : -1,
			{ width, height } = this.renderer.size(),
			size = numYValues === -1 ? [5, 20] : [Math.max( 1, Math.min( 5, 0.4 * height / numYValues ) ), Math.max( 1, Math.min( 20, 0.4 * height / numYValues ) ) ],
			displayPoints = points.filter( p => {
				return !isNaN( p.x + p.y + p.size );
			} ).map( p => {
				return {
					type: "circle",
					cx: p.x * width,
					cy: p.y * height,
					r: size[0] + 0.5 * p.size * ( size[1] - size[0] ),
					title: p.title,
					opacity: 0.8,
					fill: p.fill
				};
			} );

		this.renderer.render( displayPoints );
	}

	resize() {
		this.render( this.points );
	}
}

export function point( obj, composer ) {
	return new Point( obj, composer );
}
