/*eslint no-unused-expressions: 0*/

import { doodler } from "./doodler";

describe( "Doodler", () => {

	let doodle = null;

	it( "should postfill styles correctly in doodle settings", () => {
		doodle = doodler( null, { styles: { } } );

		doodle.postfill( "box", "width", 0.5 );

		expect( doodle.settings.styles.box.width ).to.equal( 0.5 );
	} );

	it( "should doodle horizontal lines correctly with base style", () => {
		doodle = doodler( null, { styles: { base: { test: "test" } } } );

		expect( doodle.horizontalLine( 1, 2, 3, "line1" ) ).to.eql( {
			type: "line",
			y1: 2,
			x1: 1 - ( 3 / 2 ),
			y2: 2,
			x2: 1 + ( 3 / 2 ),
			stroke: "#000",
			strokeWidth: 1,
			test: "test"
		} );
	} );

	it( "should doodle vertical lines correctly with custom push function", () => {
		let latestPush = null;
		doodle = doodler( v => { latestPush = v; }, { styles: { line2: { test2: "test2" } } } );

		doodle.verticalLine( 1, 2, 3, "line2" );

		expect( latestPush ).to.eql( {
			type: "line",
			y1: 2,
			x1: 1,
			y2: 3,
			x2: 1,
			stroke: "#000",
			strokeWidth: 1,
			test2: "test2"
		} );
	} );

	it( "should doodle whiskers correctly", () => {
		doodle = doodler();

		doodle.postfill( "whisker", "width", 0.5 );

		expect( doodle.whisker( 1, 2 ) ).to.eql(
			doodle.horizontalLine(
				1,
				2,
				0.5,
				"whisker"
			)
		);
	} );

	it( "should doodle median correctly", () => {
		doodle = doodler();

		doodle.postfill( "box", "width", 0.7 );

		expect( doodle.median( 1, 2 ) ).to.eql(
			doodle.horizontalLine(
				1,
				2,
				0.7,
				"med"
			)
		);
	} );

} );
