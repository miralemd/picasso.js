import { renderer } from "../../../web/renderer/svg-renderer/svg-renderer";

export default class Line {
	constructor( obj, composer ) {
		this.element = composer.element;

		this.renderer = renderer();
		this.renderer.appendTo( this.element );

		this.settings = obj.settings;
		this.data = composer.data;
		this.obj = obj;

		this.x = this.settings.x ? composer.scales[this.settings.x.scale] : null;
		this.y = this.settings.y ? composer.scales[this.settings.y.scale] : null;

		this.onData();
	}

	onData() {
		this.lines = [];

		/*eslint no-unused-expressions: 0*/
		this.x && this.x.update();
		this.y && this.y.update();

		this.y.scale.nice( this.settings.ticks );
		this.x.scale.nice( this.settings.ticks );

		this.lines.x = this.x.scale.ticks( this.settings.ticks );
		this.lines.y = this.y.scale.ticks( this.settings.ticks );

		this.resize();
	}

	resize() {
		this.renderer.rect.width = this.element.clientWidth;
		this.renderer.rect.height = this.element.clientHeight;
		this.render( this.lines );
	}

	render( lines ) {
		const { width, height } = this.renderer.rect;

		if ( !Object.keys( this.settings.styles )[0] ) {
			return;
		}

		let highestSparsity = Math.max( ...Object.keys( this.settings.styles ) );
		let lowestSparsity = Math.min( ...Object.keys( this.settings.styles ) );
		let style = {};

		let i = 1;
		const displayLinesX = lines.x.map( p => {
			if ( i >= highestSparsity ) {
				i = 1;
			}
			i++;

			style = this.settings.styles[i] || this.settings.styles[lowestSparsity];

			return {
				type: "line",
				x1: this.x.scale.get( p ) * width,
				y1: 0,
				x2: this.x.scale.get( p ) * width,
				y2: height,
				style: `stroke: ${style.color}; stroke-width: ${style.lineWidth}`
			};
		} );

		i = 1;
		const displayLinesY = lines.y.map( p => {
			if ( i >= highestSparsity ) {
				i = 1;
			}
			i++;

			style = this.settings.styles[i] || this.settings.styles[lowestSparsity];

			return {
				type: "line",
				x1: 0,
				y1: this.y.scale.get( p ) * height,
				x2: width,
				y2: this.y.scale.get( p ) * height,
				style: `stroke: ${style.color}; stroke-width: ${style.lineWidth}`
			};
		} );

		this.renderer.render( [...displayLinesX, ...displayLinesY] );
	}

}

export function line( obj, composer ) {
	return new Line( obj, composer );
}
