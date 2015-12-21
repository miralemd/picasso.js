export default class Range {
	constructor() {

	}

	/**
	 *
	 * @param options
	 */
	layout( options ) {
		var data = options.data,
			series = options.series,
			measureScale = options.measureScale,
			dimensionScale = options.dimensionScale,
			orientation = options.orientation || "vertical",
			attrM = orientation === "vertical" ? "y" : "x",
			attrD = attrM === "x" ? "y" : "x",
			unitSize = dimensionScale.getUnitSize(),
			output = [],
			len = Math.max.apply( null, data.map( v => v.length ) );

		for ( let i = 0; i < series.length; i++ ) {
			let ut = [];
			output.push( ut );
			for ( let j = 0; j < len; j++ ) {
				let v = {[attrD]: {
					start: dimensionScale.get( j, 0 ) - unitSize / 2 + unitSize * i,
					end: dimensionScale.get( j, 0 ) + unitSize / 2 + unitSize * i
				}};

				let m = v[attrM] = {};

				for( let p in series[i] ) {
					m[p] = typeof series[i][p] === "number" ? measureScale.get( series[i][p] ) :
						measureScale.get( data[Number( series[i][p])][j] );
				}
				ut.push( v );
			}
		}

		return {
			orientation: orientation,
			series: output
		};
	}
}
