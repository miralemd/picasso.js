/*eslint no-return-assign: 0*/
import { formatter } from "../formatter";

// TODO - decide whether usage of .call() is appropriate when invoking accessors, if yes then arrow functions are not allowed!

const accessors = {
	tags: data => data.tags,
	min: data => data.min,
	max: data => data.max,
	title: data => data.title,
	values: data => data.values,
	formatter: () => formatter( "d3" )( "number" )( "" )
};

export function field() {
	let data = {},
		acc = {
			min: accessors.min,
			max: accessors.max,
			tags: accessors.tags,
			title: accessors.title,
			values: accessors.values,
			formatter: accessors.formatter
		};

	function fn() {}

	fn.data = d => d ? ( data = d, fn ) : data;

	fn.tags = f => f ? ( acc.tags = f, fn ) : acc.tags( data );

	fn.min = f => f ? ( acc.min = f, fn ) : acc.min( data );

	fn.max = f => f ? ( acc.max = f, fn ) : acc.max( data );

	fn.title = f => f ? ( acc.title = f, fn ) : acc.title( data );

	fn.values = f => f ? ( acc.values = f, fn ) : acc.values( data );

	fn.formatter = f => f ? ( acc.formatter = f, fn ) : acc.formatter( data );

	return fn;
}
