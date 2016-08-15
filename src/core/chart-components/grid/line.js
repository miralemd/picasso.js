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

		this.settings.style = Object.assign( {}, {
			color: "rgb(225, 225, 225)",
			sparsity: 1,
			ticks: 10,
			linewidth: 1
		}, this.settings.style );

		this.onData();
	}

	onData() {
		this.lines = [];

		/*eslint no-unused-expressions: 0*/
		this.x && this.x.update();
		this.y && this.y.update();
		this.y.scale.nice( 1 );
		this.x.scale.nice( 1 );
		this.lines.x = this.x.scale.ticks( this.settings.style.ticks );
		this.lines.y = this.y.scale.ticks( this.settings.style.ticks );

		this.resize();
	}

	resize() {
		this.renderer.rect.width = this.element.clientWidth;
		this.renderer.rect.height = this.element.clientHeight;
		this.render( this.lines );
	}

	render( lines ) {
		const { width, height } = this.renderer.rect;

		let i = 0;
		const displayLinesX = lines.x.filter( () => {
			i++;
			return i % this.settings.style.sparsity === 0;
		} ).map( p => {
			return {
				type: "line",
				x1: this.x.scale.get( p ) * width,
				y1: 0,
				x2: this.x.scale.get( p ) * width,
				y2: height,
				style: `stroke: ${this.settings.style.color}; stroke-width: ${this.settings.style.linewidth}`
			};
		} );

		i = 0;
		const displayLinesY = lines.y.filter( () => {
			i++;
			return i % this.settings.style.sparsity === 0;
		} ).map( p => {
			return {
				type: "line",
				x1: 0,
				y1: this.y.scale.get( p ) * height,
				x2: width,
				y2: this.y.scale.get( p ) * height,
				style: `stroke: ${this.settings.style.color}; stroke-width: ${this.settings.style.linewidth}`
			};
		} );

		this.renderer.render( [...displayLinesX, ...displayLinesY] );
	}

}

export function line( obj, composer ) {
	return new Line( obj, composer );
}
