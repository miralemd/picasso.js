import { table } from "../table";
import { qField } from "./q-field";

/**
 * Data interface for the Qlik Sense hypercube format
 * @param  {function} [fieldFn=qField] Field factory function
 * @return {table}                  Data table
 */
export function qTable( fieldFn = qField ) {
	let q = table()
		.rows( d => d.qSize.qcy )
		.cols( d => d.qSize.qcx )
		.fields( d => d.qDimensionInfo.concat( d.qMeasureInfo ).map( f => fieldFn().data( f ) ) );

	return q;
}
