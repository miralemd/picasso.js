/*eslint no-unused-expressions: 0*/

import { numberFormatFactory } from "../../../../../../src/core/formatter/q/parts/qs-number-formatter";

describe( "qs-number-formatter", () => {
	let n;

	it( "should not format without pattern", function () {
		n = numberFormatFactory( null );

		expect( n.format( 0 ) ).to.equal( "0" );
		expect( n.format( 0.123456789 ) ).to.equal( "0.123456789" );
		expect( n.format( -50000 ) ).to.equal( "-50000" );

	} );

	it( "should format NaNs correctly", function() {
		n = numberFormatFactory( null );

		expect( n.format( NaN ) ).to.be.NaN;
		expect( n.format( "NaN" ) ).to.equal( "NaN" );
	} );

	it( "should not format strings", function () {
		n = numberFormatFactory( null );
		expect( n.format( "Hello World" ) ).to.equal( "Hello World" );
	} );

	it( "should format scientific notation", function () {
		n = numberFormatFactory( null, "###0", "", "," );

		expect( n.format( 1.5e+24 ) ).to.equal( "1,5e+24" );
		expect( n.format( 1.567e+33 ) ).to.equal( "1,567e+33" );
		expect( n.format( 1e-107 ) ).to.equal( "1e-107" );
	} );

	it( "numbers >= 1e15 should always be formatted in scientific notation, regardless of format pattern", function () {
		n = numberFormatFactory( null, "#", ",", "." );

		expect( n.format( 1.123e15, "#" ) ).to.equal( "1e+15" );
		expect( n.format( 1.123e15, "0" ) ).to.equal( "1.123e+15" );
	} );

	it( "should round values larger than -0.5 to 0 and not -0", function(){
		n = numberFormatFactory( null, "#", ",", ".", "I" );
		expect( n.format( 0.3 ) ).to.equal( "0" );
		expect( n.format( -0.3 ) ).to.equal( "0" );
		expect( n.format( -0.7 ) ).to.equal( "-1" );

		n = numberFormatFactory( null, "0", ",", ".", "F" );
		expect( n.format( 0.3 ) ).to.equal( "0" );
		expect( n.format( -0.3 ) ).to.equal( "0" );
		expect( n.format( -0.7 ) ).to.equal( "-1" );
	} );

	it( "should use significant digits from pattern when decimal pattern is not defined", function () {
		n = numberFormatFactory( null, "#", ",", "." );

		expect( n.format( 1, "#" ) ).to.equal( "1" );
		expect( n.format( 15, "#" ) ).to.equal( "2e+1" );
		expect( n.format( 145, "#" ) ).to.equal( "1e+2" );
		expect( n.format( 155, "#" ) ).to.equal( "2e+2" );
		expect( n.format( 155, "#0" ) ).to.equal( "155" );

		expect( n.format( 1234567, "#-###", "-" ) ).to.equal( "1.235e+6" );

		expect( n.format( 0.1, "#" ) ).to.equal( "0.1" );
		expect( n.format( 0.1, "####" ) ).to.equal( "0.1" );
		expect( n.format( 0.12345, "#" ) ).to.equal( "0.1" );
		expect( n.format( 0.12345, "##" ) ).to.equal( "0.12" );
		expect( n.format( 0.12345, "###" ) ).to.equal( "0.123" );

		expect( n.format( 0.100500, "#########" ) ).to.equal( "0.1005" );

		expect( n.format( 0.00099, "#" ) ).to.equal( "0.001" );
		expect( n.format( 0.00001, "#" ) ).to.equal( "1e-5" );

		expect( n.format( 1e2, "#" ) ).to.equal( "1e+2" );

		expect( n.format( 0.000001, "##########" ) ).to.equal( "1e-6" );
		expect( n.format( 0.00000123, "##########" ) ).to.equal( "1.23e-6" );

		expect( n.format( 1.2345, "#" ) ).to.equal( "1" );
		expect( n.format( 1.2345, "##" ) ).to.equal( "1.2" );
		expect( n.format( 1.2345, "###" ) ).to.equal( "1.23" );
		expect( n.format( 1.2345, "#########" ) ).to.equal( "1.2345" );

		expect( n.format( 99.123, "#" ) ).to.equal( "1e+2" );
		expect( n.format( 99.123, "##" ) ).to.equal( "99" );
		expect( n.format( 99.123, "####" ) ).to.equal( "99.12" );
		expect( n.format( 1234.5, "##,###", "," ) ).to.equal( "1,234.5" );

		expect( n.format( 1000000, "###,###", "," ) ).to.equal( "1e+6" );
	} );

	it( "should support negative numbers", function () {
		n = numberFormatFactory( null, "#.##", ",", "." );
		expect( n.format( -1 ) ).to.equal( "-1" );
		expect( n.format( -0.1234 ) ).to.equal( "-0.12" );
		//				expect( n.format( -1.2345678e-20 ) ).to.equal("-1.23e-20");
	} );

	it( "should support arbitrary grouping separator", function () {
		n = numberFormatFactory( null );
		n.thousandDelimiter = "";
		expect( n.format( 123456789, "#,##0", "," ) ).to.equal( "123,456,789" );
		expect( n.format( 123456789, "0", "" ) ).to.equal( "123456789" );
		expect( n.format( 123456789, "#abc##0", "abc" ) ).to.equal( "123abc456abc789" );
		expect( n.format( 123456789, "#abc###,0", "abc", "," ) ).to.equal( "123abc456abc789,0" );
		expect( n.format( 123456789, "#,.?+[{})(##0", ",.?+[{})(" ) ).to.equal( "123,.?+[{})(456,.?+[{})(789" );

	} );

	it( "should support arbitrary decimal separator", function () {
		n = numberFormatFactory( null );

		expect( n.format( 1.23, "#.##", ",", "." ) ).to.equal( "1.23" );
		expect( n.format( 1.23, "#,##", " ", "," ) ).to.equal( "1,23" );
		expect( n.format( 1.23, "#abc##", " ", "abc" ) ).to.equal( "1abc23" );
		expect( n.format( 1.23, "#,.?+[{})##", " ", ",.?+[{})" ) ).to.equal( "1,.?+[{})23" );

	} );

	it( "should support arbitrary mix of grouping and decimal separators", function () {
		n = numberFormatFactory( null, "", "", "" );
		n.decimalDelimiter = "";
		n.thousandDelimiter = "";

		expect( n.format( 123456789.987, "# ###.###", " ", "." ) ).to.equal( "123 456 789.987" );
		expect( n.format( 123456789.987, "#.###,###", ".", "," ) ).to.equal( "123.456.789,987" );
		expect( n.format( 123456789.987, "#'###?###", "'", "?" ) ).to.equal( "123'456'789?987" );
		expect( n.format( 123456789.987, "#-###,###", "-", "," ) ).to.equal( "123-456-789,987" );
		expect( n.format( 123456789.987, "#.##0", ".", "" ) ).to.equal( "123.456.790" );

		expect( n.format( 12345.987, "##0--000", "", "--" ) ).to.equal( "12345--987" );

		expect( n.format( 123456789.987, "### 00", "", " " ) ).to.equal( "123456789 99" );

		expect( n.format( 123456789.987, "#,.?+[{})###,.?+[{}(###", ",.?+[{})", ",.?+[{}(" ) ).to.equal( "123,.?+[{})456,.?+[{})789,.?+[{}(987" );

	} );

	it( "should ignore grouping if grouping separator is same as decimal separator", function () {
		n = numberFormatFactory( null );

		expect( n.format( 123456789.987, "#.###.###", ".", "." ) ).to.equal( "123456789.987" );
		expect( n.format( 123456789.987, "#,.?+[{})###,.?+[{})###", ",.?+[{})", ",.?+[{})" ) ).to.equal( "123456789,.?+[{})987" );

	} );

	it( "should format integers", function () {
		n = numberFormatFactory( null, "0" );

		expect( n.format( 0 ) ).to.equal( "0" );
		expect( n.format( 1 ) ).to.equal( "1" );
		expect( n.format( 100 ) ).to.equal( "100" );
		expect( n.format( 1000 ) ).to.equal( "1000" );
		expect( n.format( 100000 ) ).to.equal( "100000" );

		n.pattern = "0000";
		expect( n.format( 0 ) ).to.equal( "0000" );
		expect( n.format( 1 ) ).to.equal( "0001" );
		expect( n.format( 100 ) ).to.equal( "0100" );

	} );

	it( "should format decimals", function () {
		n = numberFormatFactory( null, "#.00" );

		expect( n.format( 0.1234 ) ).to.equal( "0.12" );
		expect( n.format( 1.5678 ) ).to.equal( "1.57" );
		expect( n.format( 1.995 ) ).to.equal( "2.00" );
		expect( n.format( 100.2 ) ).to.equal( "100.20" );
		expect( n.format( 1000 ) ).to.equal( "1000.00" );
		expect( n.format( 100000 ) ).to.equal( "100000.00" );

		n.pattern = "#.0";

		expect( n.format( 0.1234 ) ).to.equal( "0.1" );
		expect( n.format( 1.5678 ) ).to.equal( "1.6" );
		expect( n.format( 1.955 ) ).to.equal( "2.0" );
		expect( n.format( 17.957601273148124 ) ).to.equal( "18.0" );
		expect( n.format( 100.2 ) ).to.equal( "100.2" );
		expect( n.format( 1000 ) ).to.equal( "1000.0" );
		expect( n.format( 100000 ) ).to.equal( "100000.0" );

		n.pattern = "#.0##";
		expect( n.format( 0 ) ).to.equal( "0.0" );
		expect( n.format( 1.5678 ) ).to.equal( "1.568" );
		expect( n.format( 100.2 ) ).to.equal( "100.2" );

	} );

	it( "should support grouping", function () {
		n = numberFormatFactory( null, "#,###.00", ",", "." );

		expect( n.format( 0 ) ).to.equal( "0.00" );
		expect( n.format( 1 ) ).to.equal( "1.00" );
		expect( n.format( 100 ) ).to.equal( "100.00" );
		expect( n.format( 1000 ) ).to.equal( "1,000.00" );
		expect( n.format( 100000 ) ).to.equal( "100,000.00" );
		expect( n.format( 10000000 ) ).to.equal( "10,000,000.00" );

		expect( n.format( 123456789876543, "####-###0", "-" ) ).to.equal( "123-4567-8987-6543" );
		expect( n.format( 123456789, "####-###0", "-" ) ).to.equal( "1-2345-6789" );

	} );

	it( "should support SI abbreviations", function () {
		n = numberFormatFactory( null, "#,###.0A", "," );

		expect( n.format( 0 ) ).to.equal( "0.0" );
		expect( n.format( 1 ) ).to.equal( "1.0" );
		expect( n.format( 100 ) ).to.equal( "100.0" );
		expect( n.format( 1000 ) ).to.equal( "1.0k" );
		expect( n.format( 100000 ) ).to.equal( "100.0k" );
		expect( n.format( 10000000 ) ).to.equal( "10.0M" );

		expect( n.format( 1234567, "#.###A" ) ).to.equal( "1.235M" );
		expect( n.format( 0.0001, "#.#A" ) ).to.equal( "0.1m" );

	} );

	it( "should support percentage", function () {
		n = numberFormatFactory( null, "0.0%" );

		expect( n.format( 0 ) ).to.equal( "0.0%" );
		expect( n.format( 0.275 ) ).to.equal( "27.5%" );
		expect( n.format( 0.17957601273148124 ) ).to.equal( "18.0%" );
		expect( n.format( 1 ) ).to.equal( "100.0%" );

		n.pattern = "%";
		expect( n.format( 0 ) ).to.equal( "%0" );
		expect( n.format( 0.275 ) ).to.equal( "%3e+1" );
		expect( n.format( 1 ) ).to.equal( "%1e+2" );
	} );

	it( "should support text surrounding the pattern", function () {
		n = numberFormatFactory( null, "", "," );

		expect( n.format( 1.234, "foo0.0bar" ) ).to.equal( "foo1.2bar" );
		expect( n.format( 123456789, "$(#,##0)" ) ).to.equal( "$(123,456,789)" );
		expect( n.format( -123456789, "$(#,##0)" ) ).to.equal( "$(-123,456,789)" );
		expect( n.format( 0.23456, "$(#,###.00)%" ) ).to.equal( "$(23.46)%" );
	} );

	it( "should support positive and negative formatting", function () {
		n = numberFormatFactory( null, "0.0;(0.0)" );

		expect( n.format( 1.234 ) ).to.equal( "1.2" );
		expect( n.format( -1.234 ) ).to.equal( "(1.2)" );
	} );

	it( "should support hexadecimal formatting", function () {
		n = numberFormatFactory( null, "(hex)" );

		expect( n.format( 0 ) ).to.equal( "0" );
		expect( n.format( 1 ) ).to.equal( "1" );
		expect( n.format( 10 ) ).to.equal( "a" );
		expect( n.format( 15, "(HEX)" ) ).to.equal( "F" );
		expect( n.format( 16 ) ).to.equal( "10" );
		expect( n.format( 199, "(hex)" ) ).to.equal( "c7" );
		expect( n.format( 199, "(HEX)" ) ).to.equal( "C7" );
		//expect( n.format( 10.2, '(hex)' ) ).to.equal( 'a.3333333' );

		expect( n.format( -10, "(hex)" ) ).to.equal( "-a" );

	} );

	it( "should support octal formatting", function () {
		n = numberFormatFactory( null, "(oct)" );

		expect( n.format( 0 ) ).to.equal( "0" );
		expect( n.format( 1 ) ).to.equal( "1" );
		expect( n.format( 10 ) ).to.equal( "12" );
		expect( n.format( 20 ) ).to.equal( "24" );

		expect( n.format( 199 ) ).to.equal( "307" );

	} );

	it( "should support binary formatting", function () {
		n = numberFormatFactory( null, "(bin)" );

		expect( n.format( 0 ) ).to.equal( "0" );
		expect( n.format( 1 ) ).to.equal( "1" );
		expect( n.format( 10 ) ).to.equal( "1010" );
		expect( n.format( 15.15 ) ).to.equal( "1111.0010011001" );

		expect( n.format( 199 ) ).to.equal( "11000111" );

	} );

	it( "should support arbitrary base/radix", function () {
		n = numberFormatFactory( null, "(r04)" );

		expect( n.format( 0 ) ).to.equal( "0" );
		expect( n.format( 1 ) ).to.equal( "1" );
		expect( n.format( 6 ) ).to.equal( "12" );
		expect( n.format( 20 ) ).to.equal( "110" );
	} );

	it( "should not format if radix is less than 2 or larger than 36", function () {
		n = numberFormatFactory( null );

		expect( n.format( 1.123, "(r60)" ) ).to.equal( "(r61)" ); // the pattern (r60) will be interpreted as prefix '(r6', pattern '0' followed by postfix ')'
		expect( n.format( 1.123, "(r61)" ) ).to.equal( "(r61)1" );

		expect( n.format( 0.123, "(r61)" ) ).to.equal( "(r61)0.1" );
		expect( n.format( 123, "(r61)" ) ).to.equal( "(r61)1e+2" );
	} );

	it( "should support roman numerals", function(){
		n = numberFormatFactory( null, "(ROM)" );

		expect( n.format( 0 ) ).to.equal( "0" );
		expect( n.format( 1 ) ).to.equal( "I" );
		expect( n.format( 2 ) ).to.equal( "II" );
		expect( n.format( 3 ) ).to.equal( "III" );
		expect( n.format( 4 ) ).to.equal( "IV" );
		expect( n.format( 5 ) ).to.equal( "V" );
		expect( n.format( 6 ) ).to.equal( "VI" );
		expect( n.format( 9 ) ).to.equal( "IX" );
		expect( n.format( 10 ) ).to.equal( "X" );
		expect( n.format( 40 ) ).to.equal( "XL" );
		expect( n.format( 45 ) ).to.equal( "XLV" );
		expect( n.format( 90 ) ).to.equal( "XC" );
		expect( n.format( 100 ) ).to.equal( "C" );
		expect( n.format( 400 ) ).to.equal( "CD" );
		expect( n.format( 500 ) ).to.equal( "D" );
		expect( n.format( 900 ) ).to.equal( "CM" );
		expect( n.format( 999 ) ).to.equal( "CMXCIX" );
		expect( n.format( 1000 ) ).to.equal( "M" );
		expect( n.format( 3999 ) ).to.equal( "MMMCMXCIX" );
		expect( n.format( 4000 ) ).to.equal( "MMMM" );

		// decimals should be ignored
		expect( n.format( 0.12345 ) ).to.equal( "0" );
		expect( n.format( 1.2345 ) ).to.equal( "I" );
		expect( n.format( 1.987 ) ).to.equal( "I" );
		expect( n.format( 999.987 ) ).to.equal( "CMXCIX" );

		// should handle negative values
		expect( n.format( -0.12345 ) ).to.equal( "0" );
		expect( n.format( -1.2345 ) ).to.equal( "-I" );
		expect( n.format( -1.987 ) ).to.equal( "-I" );
		expect( n.format( -9.6 ) ).to.equal( "-IX" );
		expect( n.format( -9.4 ) ).to.equal( "-IX" );
		expect( n.format( -999.987 ) ).to.equal( "-CMXCIX" );

		// should return the same format as engine when value > 500000
		expect( n.format( 500001 ) ).to.equal( "(ROM)5e+5" );
		expect( n.format( -99999999 ) ).to.equal( "(ROM)-1e+8" );

		// should return lowercase letters when lowercase pattern is used
		n.pattern = "(rom)";
		expect( n.format( 1959 ) ).to.equal( "mcmlix" );
		expect( n.format( 50 ) ).to.equal( "l" );
	} );
} );
