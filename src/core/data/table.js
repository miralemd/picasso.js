/* eslint no-return-assign: 0 */
export function table() {
	let dd = {},
		acc = {
			rows: () => 0,
			cols: () => 0,
			fields: () => []
		};

	function fn() {}

	fn.data = function( d ) {
		if ( d ) {
			dd = d;
			return fn;
		}
		return dd;
	};

	fn.rows = function( f ) {
		return f ? ( acc.rows = f, fn ) : acc.rows( dd );
	};

	fn.cols = function( f ) {
		return f ? ( acc.cols = f, fn ) : acc.cols( dd );
	};

	fn.fields = function( f ) {
		return f ? ( acc.fields = f, fn ) : acc.fields( dd );
	};

	return fn;
}
