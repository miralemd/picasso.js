/*eslint no-unused-expressions: 0*/

import { boxPrerend } from "./box-prerend";

describe( "boxPrerend", () => {

	let draw = boxPrerend();

	it( "should return correct opposite keys", () => {
		draw.vertical = true;

		// Get the opposite key to what you put in, height when you put in width etc
		expect( draw.getActualKey( "width" ) ).to.equal( "height" );
		expect( draw.getActualKey( "height" ) ).to.equal( "width" );

		// Same applies to coordinates
		expect( draw.getActualKey( "x" ) ).to.equal( "y" );
		expect( draw.getActualKey( "y" ) ).to.equal( "x" );

		// With multiple X and Ys
		expect( draw.getActualKey( "x1" ) ).to.equal( "y1" );
		expect( draw.getActualKey( "y2" ) ).to.equal( "x2" );
	} );

	it( "should return correct coordinates", () => {
		// Make sure the width and height are set,
		// all coordinates will be coordinate * width or height
		draw.width = 2;
		draw.height = 3;

		draw.vertical = false;
		draw.flipY = false;
		draw.flipX = false;

		// Check if the coordinates respond correctly to the values
		expect( draw.coordinateToValue( "width", 2 ) ).to.equal( 4 );
		expect( draw.coordinateToValue( "height", 3 ) ).to.equal( 9 );

		expect( draw.coordinateToValue( "x1", 4 ) ).to.equal( 8 );
		expect( draw.coordinateToValue( "y2", 0.5 ) ).to.equal( 1.5 );

		expect( draw.coordinateToValue( "x", 5 ) ).to.equal( 10 );
		expect( draw.coordinateToValue( "y", 0.5 ) ).to.equal( 1.5 );

		// Flip it all
		draw.vertical = false;
		draw.flipY = true;
		draw.flipX = true;

		expect( draw.coordinateToValue( "y", 0.25, { height: 0.5 } ) ).to.equal( 0.75 );
		expect( draw.coordinateToValue( "x", 0.75, { height: 0.25 } ) ).to.equal( 0.5 );

		// Check so that it handles other values Ok
		expect( draw.coordinateToValue( "height", "test" ) ).to.equal( "test" );
		expect( draw.coordinateToValue( "height", NaN ) ).to.be.NaN;
	} );

	it( "should handle basic pushing correctly", () => {
		let dummy1 = { dummy1: "dummy1" };
		let dummy2 = { dummy2: "dummy2" };

		draw = boxPrerend( dummy2 );

		draw.push( dummy1 );

		expect( draw.storage[0] ).to.equal( dummy2 );
		expect( draw.storage[1] ).to.equal( dummy1 );
	} );

	it( "should export the expected objects in horizontal mode", () => {
		let dummy = {
			x: 0.25,
			y: 0.75,
			width: 0.375,
			height: 0.125
		};

		draw = boxPrerend( dummy );
		draw.width = 100;
		draw.height = 100;

		let output = draw.output();

		expect( output[0].x ).to.equal( 25 );
		expect( output[0].y ).to.equal( 75 );
		expect( output[0].width ).to.equal( 37.5 );
		expect( output[0].height ).to.equal( 12.5 );
	} );

	it( "should export the expected objects in vertical mode", () => {
		let dummy = {
			x: 0.25,
			y: 0.75,
			width: 0.375,
			height: 0.125
		};

		draw = boxPrerend( dummy );
		draw.width = 100;
		draw.height = 100;
		draw.vertical = true;

		let output = draw.output();

		expect( output[0].y ).to.equal( 25 );
		expect( output[0].x ).to.equal( 75 );
		expect( output[0].height ).to.equal( 37.5 );
		expect( output[0].width ).to.equal( 12.5 );
	} );

	it( "should export the expected objects in vertical mode with flipped axels", () => {
		let dummy = {
			x: 0.25,
			y: 0.75,
			width: 0.375,
			height: 0.125
		};

		draw = boxPrerend( dummy );
		draw.width = 100;
		draw.height = 100;
		draw.vertical = true;
		draw.flipX = true;
		draw.flipY = true;

		let output = draw.output();

		expect( output[0].y ).to.equal( 37.5 );
		expect( output[0].x ).to.equal( 12.5 );
		expect( output[0].height ).to.equal( 37.5 );
		expect( output[0].width ).to.equal( 12.5 );
	} );

} );
