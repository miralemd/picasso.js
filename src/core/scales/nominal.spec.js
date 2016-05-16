import Nominal from "./nominal";

describe( "NominalScale", () => {
	let nom;

	it( "should have empty array as defaults", () => {
		nom = new Nominal();
		expect( nom.getLevels() ).to.deep.equal( [[]] );
	} );

	it( "should handle string values as input", () => {
		nom = new Nominal( ["a", "b"] );
		expect( nom.getLevels() ).to.deep.equal( [[
			{ name: "a", idx: 0, span: 1 },
			{ name: "b", idx: 1, span: 1 }
		]] );

		expect( nom.getUnitSize() ).to.equal( 0.5 );
	} );

	it( "should handle objects as input", () => {
		nom = new Nominal( [
			{ name: "a" },
			{ name: "b" }
		] );

		expect( nom.getLevels() ).to.deep.equal( [[
			{ name: "a", idx: 0, span: 1 },
			{ name: "b", idx: 1, span: 1 }
		]] );

		expect( nom.getUnitSize() ).to.equal( 0.5 );
	} );

	it( "should create multiple levels when input is hierarchical", () => {
		nom = new Nominal( [
			{ name: "a", children: ["aa", "ab"] },
			{ name: "b", children: ["ba", "bb"] }
		] );

		expect( nom.getLevels() ).to.deep.equal( [
			[
				{ name: "a", idx: 0, span: 2 },
				{ name: "b", idx: 2.5, span: 2 }
			],
			[
				{ name: "aa", idx: 0, span: 1 },
				{ name: "ab", idx: 1, span: 1 },
				{ name: "ba", idx: 2.5, span: 1 },
				{ name: "bb", idx: 3.5, span: 1 }
			]
		] );
		expect( nom.getUnitSize().toPrecision( 5 ) ).to.equal( ( 1 / 4.5 ).toPrecision( 5 ) ); // 4 units + 0.5 separation between groups
	} );

	it( "should update the unitSize when changing output range", () => {
		nom = new Nominal( ["a", "b"] );
		nom.to( [0, 10] );
		expect( nom.getUnitSize() ).to.equal( 5 );
	} );

	it( "should return 2.5 for the first value", () => {
		nom = new Nominal( ["a", "b"], [0, 10] );
		expect( nom.get( 0 ) ).to.equal( 2.5 ); // start to end = 0-5 -> center at 2.5
	} );

	it( "should return 0.25 for the first value", () => {
		nom = new Nominal( [
			{ name: "a", children: ["aa", "ab", "ac"] }
		], [0, 1], { groupSeparation: 1 } );
		expect( nom.units ).to.equal( 4 );
		expect( nom.get( 1, 1 ) ).to.equal( 0.5 ); // second value in second level is in the middle of scale
	} );
} );
