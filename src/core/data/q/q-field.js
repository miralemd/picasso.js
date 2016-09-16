import { field } from "../field";

export function qField() {
	let q = field()
		.min( d => d.qMin )
		.max( d => d.qMax )
		.tags( d => d.qTags )
		.title( d => d.qFallbackTitle );

	return q;
}
