import { data } from "./data";

describe( "data", () => {
	let dd;

	beforeEach( () => {
		dd = data();
		dd.data( [
			["Country", "Population"],
			["Sweden", 9000000],
			["Norway", 5000000]
		] );
	} );

	it( "should set row accessor", () => {
		expect( dd.rows( d => d.length ).rows() ).to.equal( 3 );
	} );

	it( "should set cols accessor", () => {
		expect( dd.cols( d => d[0].length ).cols() ).to.equal( 2 );
	} );

	it( "should set fields accessor", () => {
		expect( dd.fields( d => d[0].map( s => s ) ).fields() ).to.deep.equal( ["Country", "Population"] );
	} );
} );
