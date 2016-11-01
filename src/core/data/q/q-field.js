import { field } from "../field";
import { resolve } from "../json-path-resolver";
import { formatter } from "../../formatter";

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
		} )
		.formatter( d => {
			if ( d.meta.qNumFormat && d.meta.qNumFormat.qType && [ "U", "I", "R", "F", "M" ].indexOf( d.meta.qNumFormat.qType ) !== -1 ) {
				return formatter( "q" )( "number" )( d.meta.qNumFormat.qFmt, d.meta.qNumFormat.qThou || ",", d.meta.qNumFormat.qDec || ".", d.meta.qNumFormat.qType );
			}
			return ( v ) => v;
		} );

	return q;
}
