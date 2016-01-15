import Nominal from "../scales/nominal";
import Range from "../layouts/range";

export default class BarArea {
	constructor( ) {
		this.rect = {x: 0, y: 0, width: 0, height: 0};
		this.dock = "center";

		this.measureScale = undefined;
		this.dimensionScale = undefined;
	}

	update( data, options = {} ) {
		let {width, height} = this.rect,
			wRatio = options.width || 1,
			dimValues = [],
			measures = [],
			rects = [],
			staticWidth = 1,
			rangeLayout,
			lin = this.measureScale,
			nom = new Nominal(),
			series = [];

		data.forEach( function( row ) {
			dimValues.push( row.length <= 2 ? row[0] : {name: row[0], children: row.slice( 1 ).map( ( m, i ) => "M" + i )} );
			for( let c = 1; c < row.length; c++ ) {
				measures[c - 1] = measures[c - 1] || [];
				measures[c - 1].push( row[c] );
			}
		} );

		nom.setData( dimValues, {separation: options.separation} );

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
					fill: "hsl(" + (i * 360 / series.length) + ", 60%, 60%)",
					x: width * (bar.x.start + (bar.x.end - bar.x.start) * 0.5 * ( 1 - wRatio ) ),
					y: height - height * bar.y.end,
					width: width * staticWidth,
					height: height * (bar.y.end - bar.y.start)
				} );
			} );
		} );

		this.rects = rects;
	}
}
