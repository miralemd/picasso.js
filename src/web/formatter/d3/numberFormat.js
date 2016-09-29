import { formatLocale } from "d3-format";

function Formatter() {
	let locale = formatLocale( {
	  decimal: ".",
	  thousands: ",",
	  grouping: [3],
	  currency: ["$", ""]
	} );

	/**
	 * Format a value according to pattern
	 *
	 * @param  {String} p 	Pattern
	 * @param  {Number} v 	Value
	 * @return {String}   	Formatted value
	 */
	function format( p, v ) {
		return locale.format( p )( v );
	}

	/**
	 * Returns a formatting function using the specified pattern
	 *
	 * @param  {String} args 	Pattern
	 * @return {Function}      	Formatting function
	 */
	format.pattern = function( ...args ) {
		return locale.format( ...args );
	};

	/**
	 * Set the locale for the formatter
	 *
	 * @param  {Object} args 	Locale object for formatting
	 * @return {Undefined}      Returns nothing
	 */
	format.locale = function( ...args ) {
		locale = formatLocale( ...args );
	};

	return format;
}

export function formatter() {
	return new Formatter();
}
