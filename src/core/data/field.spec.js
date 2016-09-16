import { field } from "./field";

describe( "Field", () => {
	let f;
	beforeEach( () => {
		f = field();
	} );

	describe( "defaults", () => {
		const dd = {
			min: 1,
			max: 2,
			tags: ["a", "b"],
			title: "wohoo"
		};
		beforeEach( () => {
			f.data( dd );
		} );

		it( "should return data", () => {
			expect( f.data() ).to.deep.equal( dd );
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

	describe( "custom accessors", () => {
		beforeEach( () => {
			f.data( {
				mm: { qMin: -3, maximum: 2 },
				meta: {
					taggar: [{ v: "numeric" }, { v: "date" }]
				},
				label: "custom"
			} );
		} );

		it( "should return min value", () => {
			expect( f.min( d => d.mm.qMin ).min() ).to.equal( -3 );
		} );

		it( "should return max value", () => {
			expect( f.max( d => d.mm.maximum ).max() ).to.equal( 2 );
		} );

		it( "should return tags", () => {
			expect( f.tags( d => d.meta.taggar.map( x => x.v ) ).tags() ).to.deep.equal( ["numeric", "date"] );
		} );

		it( "should return title", () => {
			expect( f.title( d => d.label ).title() ).to.equal( "custom" );
		} );
	} );
} );
