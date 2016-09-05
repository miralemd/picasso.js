import { boxPrerend } from "./box-prerend";

describe( "boxPrerend", () => {

	let draw = boxPrerend();

	it( "should behave somewhat like an Array", () => {
		draw.push( "asdf" );

		expect( draw ).to.deep.equal( boxPrerend( "asdf" ) );
		expect( draw[0] ).to.equal( "asdf" );
		expect( draw.length ).to.equal( 1 );
	} );

	it( "should handle width and height correctly", () => {
		draw.width = 200;
		draw.height = 400;
		draw.flipXY = true;

		expect( draw.width ).to.equal( 400 );
		expect( draw.height ).to.equal( 200 );
	} );

	it( "should return the correct opposite keys", () => {
		expect( draw.oppositeKey( "width" ) ).to.equal( "height" );
		expect( draw.oppositeKey( "height" ) ).to.equal( "width" );
		expect( draw.oppositeKey( "x1" ) ).to.equal( "y1" );
		expect( draw.oppositeKey( "y2" ) ).to.equal( "x2" );
		expect( draw.oppositeKey( "x" ) ).to.equal( "y" );
		expect( draw.oppositeKey( "y" ) ).to.equal( "x" );
	} );

	it( "should draw flipped objects correctly", () => {
		draw = boxPrerend();

		draw.flipXY = true;

		draw.push( {
			width: 25,
			height: 50,
			x1: 20,
			y2: 40
		} );

		expect( draw[0].width ).to.equal( 50 );
		expect( draw[0].height ).to.equal( 25 );
		expect( draw[0].y1 ).to.equal( 20 );
		expect( draw[0].x2 ).to.equal( 40 );
	} );

} );
