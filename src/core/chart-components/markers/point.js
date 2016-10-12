import { renderer } from "../../renderer";

const DEFAULT_FILL = "#999";

function values( table, setting ) {
	if ( setting && setting.source ) {
		return table.findField( setting.source ).values();
	}
	return null;
}

export default class Point {
	constructor( obj, composer ) {
		this.container = composer.container();

		this.renderer = renderer();
		this.renderer.appendTo( this.container );

		this.settings = obj.settings;
		this.table = composer.table();
		this.obj = obj;

		this.x = this.settings.x ? composer.scale( this.settings.x ) : null;
		this.y = this.settings.y ? composer.scale( this.settings.y ) : null;
		this.size = this.settings.size ? composer.scale( this.settings.size ) : null;
		this.fill = typeof this.settings.fill === "string" ? this.settings.fill : this.settings.fill ? composer.scale( this.settings.fill ) : null;

		this.onData();
	}

	onData() {
		this.points = [];

		let data = values( this.table, this.obj.data );
		let xValues = values( this.table, this.settings.x );
		let yValues = values( this.table, this.settings.y );
		let sizeValues = values( this.table, this.settings.size );
		let fillValues = values( this.table, this.settings.fill );

		let x = this.x;
		let y = this.y;
		let size = this.size;
		let fill = this.fill;

		this.points = data.map( ( p, i ) => {
			return {
				x: x ? x( xValues[i] ) : 0.5,
				y: y ? y( yValues[i] ) : 0.5,
				size: size ? size( sizeValues[i] ) : 1,
				fill: typeof fill === "function" ? fill( fillValues[i] ) : typeof fill === "string" ? fill : DEFAULT_FILL,
				label: p.label
			};
		} );

		this.resize();
	}

	render() {
		const points = this.points;
		const numYValues = this.y && this.y.type === "ordinal" ? this.y.scale.domain().length : -1;
		const { width, height } = this.renderer.size();
		const pointSize = numYValues === -1 ? [10, 40] : [Math.max( 1, Math.min( 5, 1 * height / numYValues ) ), Math.max( 1, Math.min( 40, 1 * height / numYValues ) ) ];
			//numXValues = this.x && this.x.type === "ordinal" ? this.x.scale.domain().length : -1,
		const displayPoints = points.filter( p => {
			return !isNaN( p.x + p.y + p.size );
		} ).map( p => {
			return {
				type: "circle",
				cx: p.x * width,
				cy: p.y * height,
				r: pointSize[0] + 0.5 * p.size * ( pointSize[1] - pointSize[0] ), // TODO - replace with scale
				title: p.label,
				opacity: 0.8,
				fill: p.fill
			};
		} );

		this.renderer.render( displayPoints );
	}

	resize() {
		this.render();
	}
}

export function point( obj, composer ) {
	return new Point( obj, composer );
}
