/*eslint no-unused-expressions: 0*/

import { doodler } from "../../../../../../src/core/chart-components/markers/generic/doodler";

describe.only( "Doodler", () => {

	let doodle, latestPush;

	beforeEach( () => {
		doodle = doodler();
		latestPush = null;
	} );

	it( "should postfill styles correctly in doodle settings", () => {
		doodle.postfill( "box", "width", 0.5 );

		expect( doodle.settings.styles.box.width ).to.equal( 0.5 );
	} );

	it( "should doodle horizontal lines correctly with base style", () => {
		doodle.settings = { styles: { base: { test: "test" } } };

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
		doodle.push = v => { latestPush = v; };
		doodle.settings = { styles: { line2: { test2: "test2" } } };

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

	it( "should doodle normal whiskers correctly", () => {
		doodle.postfill( "whisker", "width", 0.5 );

		let whisker = doodle.whisker( 1, 2 );

		expect( whisker.type ).to.eql( "line" );
		expect( whisker.y1 ).to.eql( 2 );
	} );

	it( "should doodle open whiskers correctly", () => {
		doodle.postfill( "whisker", "width", 0.5 );

		let whisker = doodle.openwhisker( 1, 2 );

		expect( whisker.type ).to.eql( "line" );
		expect( whisker.y1 ).to.eql( 2 );
	} );

	it( "should doodle open whiskers correctly", () => {
		doodle.postfill( "whisker", "width", 0.5 );

		let whisker = doodle.closewhisker( 1, 2 );

		expect( whisker.type ).to.eql( "line" );
		expect( whisker.y1 ).to.eql( 2 );
	} );

	it( "should doodle median correctly", () => {
		doodle.postfill( "box", "width", 0.7 );

		let median = doodle.median( 1, 2 );

		expect( median.type ).to.eql( "line" );
		expect( median.y1 ).to.eql( 2 );
	} );

	it( "should doodle a box correctly", () => {
		doodle.postfill( "box", "width", 0.75 );

		expect( doodle.box( 1, 2, 3, "box" ) ).to.eql(
			{
				type: "rect",
				x: 1 - ( 0.75 / 2 ),
				y: 2,
				height: 3,
				width: 0.75,
				fill: "#fff",
				stroke: "#000"
			}
		);
	} );
} );
