/*eslint no-unused-expressions: 0*/

import { formatter as numberFormat } from "./numberFormat";

describe( "numberFormat", () => {

	it( "should swallow a pattern", () => {

		let formatter = numberFormat( "0.2f" );

		expect( formatter( 0.123 ) ).to.equal( "0.12" );

	} );

	it( "should format manually correctly", () => {

		let formatter = numberFormat( "0.2f" );

		expect( formatter.format( "0.1f", 0.123 ) ).to.equal( "0.1" );

	} );

	it( "should allow for custom locale", () => {

		let formatter = numberFormat( "0.2f" ).locale( {
		  "decimal": ",",
		  "thousands": "\u00a0",
		  "grouping": [3],
		  "currency": ["", "SEK"]
		} );

		expect( formatter( 0.123 ) ).to.equal( "0,12" );

		expect( formatter.format( "0.1f", 0.123 ) ).to.equal( "0,1" );

	} );

} );
