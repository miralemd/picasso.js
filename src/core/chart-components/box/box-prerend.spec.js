import { boxPrerend } from "./box-prerend";

describe( "boxPrerend", () => {

	let draw = boxPrerend();

	it( "should return the correct opposite keys", () => {

		// Get the opposite key to what you put in, height when you put in width etc
		expect( draw.oppositeKey( "width" ) ).to.equal( "height" );
		expect( draw.oppositeKey( "height" ) ).to.equal( "width" );

		// Same applies to coordinates
		expect( draw.oppositeKey( "x" ) ).to.equal( "y" );
		expect( draw.oppositeKey( "y" ) ).to.equal( "x" );

		// With multiple X and Ys
		expect( draw.oppositeKey( "x1" ) ).to.equal( "y1" );
		expect( draw.oppositeKey( "y2" ) ).to.equal( "x2" );
	} );

	it( "should return the correct opposite keys", () => {
		// Make sure the width and height are set,
		// all coordinates will be coordinate * width or height
		draw.width = 2;
		draw.height = 3;

		// Check if the coordinates respond correctly to the values
		expect( draw.coordinateToValue( "width", 2 ) ).to.equal( 4 );
		expect( draw.coordinateToValue( "height", 3 ) ).to.equal( 9 );

		expect( draw.coordinateToValue( "x1", 4 ) ).to.equal( 8 );
		expect( draw.coordinateToValue( "y2", 4 ) ).to.equal( 12 );

		expect( draw.coordinateToValue( "x", 5 ) ).to.equal( 10 );
		expect( draw.coordinateToValue( "y", 5 ) ).to.equal( 15 );
	} );

} );
