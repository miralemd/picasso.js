import { field } from "../field";
import { resolve } from "../json-path-resolver";

export function qField() {
	let q = field()
		.min( d => d.meta.qMin )
		.max( d => d.meta.qMax )
		.tags( d => d.meta.qTags )
		.title( d => d.meta.qFallbackTitle )
		.values( d => {
			return resolve( `//${d.idx}`, d.matrix ).map( v => {
				return {
					value: v.qNum,
					label: v.qText,
					id: v.qElemNumber
				};
			} );
		} );

	return q;
}
