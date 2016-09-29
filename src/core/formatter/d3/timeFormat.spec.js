/*eslint no-unused-expressions: 0*/

import { formatter as timeFormat } from "./timeFormat";

describe( "timeFormat", () => {

	it( "should format dates correctly according to constructor pattern", () => {

		let formatter = timeFormat( "%B %d, %Y" );

		expect( formatter( new Date( 2013, 10, 18 ) ) ).to.equal( "November 18, 2013" );

	} );

	it( "should format dates correctly when using custom format", () => {

		let formatter = timeFormat( "%B %d, %Y" );

		expect( formatter.format( "%Y-%m-%d", new Date( 2013, 10, 18 ) ) ).to.equal( "2013-11-18" );

	} );

	it( "should format dates correctly with a custom locale", () => {

		let formatter = timeFormat( "%A, %B %d, %Y" );

		expect( formatter( new Date( 2013, 10, 18 ) ) ).to.equal( "Monday, November 18, 2013" );

		formatter.locale( {
			"dateTime": "%A den %d %B %Y %X",
			"date": "%Y-%m-%d",
			"time": "%H:%M:%S",
			"periods": ["fm", "em"],
			"days": ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
			"shortDays": ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
			"months": ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
			"shortMonths": ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
		} );

		expect( formatter( new Date( 2013, 10, 18 ) ) ).to.equal( "Måndag, November 18, 2013" );

	} );

} );
