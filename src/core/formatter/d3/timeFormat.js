import { timeFormatLocale } from "d3-time-format";

export function formatter() {
	let locale = timeFormatLocale( {
	  dateTime: "%x, %X",
	  date: "%-m/%-d/%Y",
	  time: "%-I:%M:%S %p",
	  periods: ["AM", "PM"],
	  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	} );

	/**
	 * Format a value according to pattern
	 *
	 * @param  {String} p 	Pattern
	 * @param  {Date} v 	Value
	 * @return {String}   	Formatted value
	 */
	function format( p, v ) {
		return locale.timeFormat( p )( v );
	}

	/**
	 * Returns a formatting function using the specified pattern
	 *
	 * @param  {String} args 	Pattern
	 * @return {Function}      	Formatting function
	 */
	format.pattern = function( ...args ) {
		return locale.timeFormat( ...args );
	};

	/**
	 * Set the locale for the formatter
	 *
	 * @param  {Object} args 	Locale object for formatting
	 * @return {Undefined}      Returns nothing
	 */
	format.locale = function( ...args ) {
		locale = timeFormatLocale( ...args );
	};

	/**
	 * Parse a string to a date according to a pattern
	 *
	 * @param  {String} p 	Pattern
	 * @param  {String} v 	Value
	 * @return {Date}   	Date
	 */
	format.parse = function( p, v ) {
		return locale.parse( p )( v );
	};

	/**
	 * Parse a string to a date according to a pattern
	 *
	 * @param  {String} p 	Pattern
	 * @param  {String} v 	Value
	 * @return {Date}   	Date
	 */
	format.parse = function( p, v ) {
		return locale.parse( p )( v );
	};

	/**
	 * Returns a parser that parses strings to date according to the pattern
	 *
	 * @param  {String} p 	Pattern
	 * @return {Function}   Parser
	 */
	format.parsePattern = function( p ) {
		return locale.parse( p );
	};

	return format;
}
