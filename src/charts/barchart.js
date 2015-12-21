import CanvasRenderer from "../renderer/canvas-renderer";
import Linear from "../scales/linear";
import Nominal from "../scales/nominal";
import Range from "../layouts/range";

export default class BarChart {
	constructor( element ) {
		this.element = element;
		this.renderer = new CanvasRenderer( element );
	}

	render( data ) {
		let w = this.element.clientWidth,
			h = this.element.clientHeight,
			margin = {top: 0, right: 0, bottom: 0, left: 0},
			width = w - margin.left - margin.right,
			height = h - margin.top - margin.bottom,
			wRatio = data.options && data.options.width || 1,
			dimValues = [],
			measures = [],
			rects = [],
			staticWidth = 1,
			rangeLayout,
			lin = new Linear( [0, 1], [0, 1] ),
			nom = new Nominal(),
			series = [];

		data.matrix.forEach( function( row ) {
			dimValues.push( row.length <= 2 ? row[0] : {name: row[0], children: row.slice( 1 ).map( ( m, i ) => "M" + i )} );
			for( let c = 1; c < row.length; c++ ) {
				measures[c - 1] = measures[c - 1] || [];
				measures[c - 1].push( row[c] );
			}
		} );

		lin.from( [
			Math.min.apply( null, [0].concat( measures.map( m => Math.min.apply( null, m ) ) ) ),
			Math.max.apply( null, [0].concat( measures.map( m => Math.max.apply( null, m ) ) ) )
		] );

		nom.setData( dimValues, {separation: data.options.separation} );

		series = measures.map( ( m, i ) => ( {start: 0, end: String( i ) } ) );

		rangeLayout = new Range().layout( {
			data: measures,
			series: series,
			measureScale: lin,
			dimensionScale: nom,
			orientation: "vertical"
		} );

		staticWidth = nom.getUnitSize() * wRatio;

		rangeLayout.series.forEach( (serie, i) => {
			serie.forEach( bar => {
				rects.push( {
					type: "rect",
					fill: "hsl(" + (i * 360 / series.length) + ", 50%, 50%)",
					x: width * (bar.x.start + (bar.x.end - bar.x.start) * 0.5 * ( 1 - wRatio ) ),
					y: height - height * bar.y.end,
					width: width * staticWidth,
					height: height * (bar.y.end - bar.y.start)
				} );
			} );
		} );

		this.renderer.render( rects );
	}
}
