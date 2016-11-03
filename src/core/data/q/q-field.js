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

				let pattern = d.meta.qNumFormat.qFmt;
				let thousand = d.meta.qNumFormat.qThou || ",";
				let decimal = d.meta.qNumFormat.qDec || ".";
				let type = d.meta.qNumFormat.qType || "U";

				if ( type === "U" ) {
					pattern = "#" + decimal + "##A";
				}

				return formatter( "q" )( "number" )( pattern, thousand, decimal, type );
			}
			return ( v ) => v;
		} );

	return q;
}
