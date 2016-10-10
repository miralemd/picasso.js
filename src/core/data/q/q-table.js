import { table } from "../table";
import { qField } from "./q-field";

const DIM_RX = /^\/(?:qHyperCube\/)?qDimensionInfo\/(\d+)/;
const M_RX = /^\/(?:qHyperCube\/)?qMeasureInfo\/(\d+)/;

const fieldFactoryFn = function( fieldFn ) {
	return function( hc ) {
		return hc.qDimensionInfo.concat( hc.qMeasureInfo ).map( ( f, idx ) => {
			return fieldFn().data( {
				meta: f,
				matrix: hc.qDataPages[0].qMatrix,
				idx
			} );
		} );
	};
};

/**
 * Data interface for the Qlik Sense hypercube format
 * @param  {function} [fieldFn=qField] Field factory function
 * @return {table}                  Data table
 */
export function qTable( fieldFn = qField ) {
	let q = table()
		.rows( d => d.qSize.qcy )
		.cols( d => d.qSize.qcx )
		.fields( fieldFactoryFn( fieldFn ) );

	q.findField = function( query ) {
		const d = q.data();
		const numDimz = d.qDimensionInfo.length;
		let idx = -1;
		if ( DIM_RX.test( query ) ) {
			idx = +DIM_RX.exec( query )[1];
		} else if ( M_RX.test( query ) ) {
			idx = +M_RX.exec( query )[1] + numDimz;
		}
		return idx >= 0 ? q.fields()[idx] : undefined;
	};

	return q;
}
