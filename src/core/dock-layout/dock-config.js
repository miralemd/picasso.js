export function dockConfig( dock = "", order = 0, relevantSizeFn = () => 0 ) {

	let fn = function() {};

	fn.requiredSize = function( calcFn ) {
		if ( typeof calcFn === "function" ) {
			relevantSizeFn = calcFn;
			return this;
		}
		return relevantSizeFn;
	};

	fn.dock = function( d ) {
		if ( typeof d === "undefined" ) {
			return dock;
		}
		dock = d;
		return this;
	};

	fn.order = function( o ) {
		if ( typeof o === "undefined" ) {
			return order;
		}
		order = o;
		return this;
	};

	return fn;
}
