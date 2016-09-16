import { qField } from "./q-field";

describe( "QField", () => {
	let f;
	const dd = {
		qMin: 1,
		qMax: 2,
		qTags: ["a", "b"],
		qFallbackTitle: "wohoo"
	};
	beforeEach( () => {
		f = qField();
		f.data( dd );
	} );

	it( "should return min value", () => {
		expect( f.min() ).to.equal( 1 );
	} );

	it( "should return max value", () => {
		expect( f.max() ).to.equal( 2 );
	} );

	it( "should return tags", () => {
		expect( f.tags() ).to.deep.equal( ["a", "b"] );
	} );

	it( "should return title", () => {
		expect( f.title() ).to.equal( "wohoo" );
	} );
} );
