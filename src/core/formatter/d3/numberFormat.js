import { formatLocale } from "d3-format";

export function formatter( pattern ) {
	let locale = formatLocale( {
	  decimal: ".",
	  thousands: ",",
	  grouping: [3],
	  currency: ["$", ""]
	} );

	let d3format = locale.format( pattern );

	/**
	 * Format a value according to the specified pattern created at construct
	 *
	 * @param  {Number} value 	The number to be formatted
	 * @return {String}       	[description]
	 */
	 function format( value ) {
		 return d3format( value );
	 }

	 /**
	  * Format a value according to a specific pattern
	  * that is not the one specified in the constructor
	  *
	  * @param  {String} p 	Pattern
	  * @param  {Number} v 	Value
	  * @return {String}   	Formatted value
	  */
	 format.format = function( p, v ) {
		 return locale.format( p )( v );
	 };

	/**
	 * Set the locale for the formatter
	 *
	 * @param  {Object} args 	Locale object for formatting
	 * @return {Undefined}      Returns nothing
	 */
	format.locale = function( ...args ) {
		locale = formatLocale( ...args );
		d3format = locale.format( pattern );

		return this;
	};

	return format;
}
