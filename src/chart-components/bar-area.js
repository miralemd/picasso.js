// import Nominal from "../scales/nominal";
import Range from "../layouts/range";

export default class BarArea {
	constructor( ) {
		this.rect = {x: 0, y: 0, width: 0, height: 0};
		this.dock = "center";

		this.measureScale = undefined;
		this.dimensionScale = undefined;
	}

	data( data, options = {} ) {
		let dimValues = [],
			measures = [],
			nom = this.dimensionScale;

		data.forEach( function( row ) {
			//dimValues.push( row[0] );
			dimValues.push( row.length <= 2 ? row[0] : {name: row[0], children: row.slice( 1 ).map( ( m, i ) => "M" + i )} );
			for( let c = 1; c < row.length; c++ ) {
				measures[c - 1] = measures[c - 1] || [];
				measures[c - 1].push( row[c] );
			}
		} );

		nom.from( dimValues, {separation: options.separation} );

		this.series = measures.map( ( m, i ) => ( {start: 0, end: String( i ) } ) );
		this.measures = measures;
	}

	update( ) {
		let {width, height} = this.rect,
			rects = [],
			staticWidth,
			wRatio = 0.6,
			series = this.series,
			rangeLayout = new Range().layout( {
				data: this.measures,
				series: this.series,
				measureScale: this.measureScale,
				dimensionScale: this.dimensionScale,
				orientation: "vertical"
			} );

		staticWidth = this.dimensionScale.getUnitSize() * wRatio;

		rangeLayout.series.forEach( (serie, i) => {
			serie.forEach( bar => {
				rects.push( {
					fill: "hsl(" + (i * 360 / series.length) + ", 60%, 60%)",
					type: "rect",
					x: width * (bar.x.start + (bar.x.end - bar.x.start) * 0.5 * ( 1 - wRatio ) ),
					y: Math.min( height - height * bar.y.end, height - height * bar.y.start),
					width: Math.max(1, width * staticWidth),
					height: Math.abs(height * (bar.y.end - bar.y.start))
				} );
			} );
		} );

		this.rects = rects;
	}
}

export function bararea( ...a ) {
	return new BarArea( ...a );
}
