import { default as color } from "../../src/colors/color";

describe( "Colors", () => {

	describe( "Rgb", () => {
		it( "should handle rgb numerical values", () => {
			var c = color( "rgb(3,33,99)" );
			expect( c ).to.deep.equal( {r: 3, g: 33, b: 99, a: 1} );
		} );

		it( "should handle rgba numerical values", () => {
			var c = color( "rgba(3,33,99,0.1)" );
			expect( c ).to.deep.equal( {r: 3, g: 33, b: 99, a: 0.1} );
		} );

		it( "should handle rgb percentage values", () => {
			var c = color( "rgb(3%,33%,99%)" );
			expect( c ).to.deep.equal( {r: 8, g: 84, b: 252, a: 1} );
		} );

		it( "should handle rgba percentage values", () => {
			var c = color( "rgba(3%,33%,99%,0.5)" );
			expect( c ).to.deep.equal( {r: 8, g: 84, b: 252, a: 0.5} );
		} );

		it( "should clip numerical values", () => {
			var c = color( "rgba(256,256,256,1)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( "rgb(256,256,256)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );
		} );

		it( "should clip negative numerical values", () => {
			var c = color( "rgba(-1,-1,-1,1)" );
			expect( c ).to.deep.equal( {r: 0, g: 0, b: 0, a: 1} );

			c = color( "rgb(-1,-1,-1)" );
			expect( c ).to.deep.equal( {r: 0, g: 0, b: 0, a: 1} );
		} );

		it( "should clip percentage values", () => {
			var c = color( "rgba(101%,101%,101%,1)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( "rgb(101%,101%,101%)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );
		} );

		it( "should clip alpha value", () => {
			var c = color( "rgba(255,255,255,1.1)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );
		} );

		it( "should allow mixing numerial and percentage values", () => {
			var c = color( "rgba(30,303%,99%,1)" );
			expect( c ).to.deep.equal( { r: 30, g: 255, b: 252, a: 1 } );

			c = color( "rgb(30,303%,99%)" );
			expect( c ).to.deep.equal( { r: 30, g: 255, b: 252, a: 1 } );
		} );

		it( "should handle numerical boundry values", () => {
			var c = color( "rgb(255,255,255)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( "rgb(0, 0, 0)" );
			expect( c ).to.deep.equal( {r: 0, g: 0, b: 0, a: 1} );
		} );

		it( "should handle percentage boundry values", () => {
			var c = color( "rgb(100%,100%,100%)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( "rgb(0%,0%,0%)" );
			expect( c ).to.deep.equal( {r: 0, g: 0, b: 0, a: 1} );
		} );

		it( "should handle whitespace", () => {
			var c = color( " rgb( 100% , 100% , 100% ) " );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( " rgba( 255 , 255 , 255 , 1 ) " );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );
		} );

		it( "should not allow negative alpha values", () => {
			var c = color( "rgba(255,255,255,-1)" );
			expect( c ).to.deep.equal( undefined );
		} );

		it( "should not allow non-digit characters", () => {
			var c = color( "rgba(a,b,c,d)" );
			expect( c ).to.deep.equal( undefined );

			c = color( "rgb(a,b,c)" );
			expect( c ).to.deep.equal( undefined );
		} );
	} )

	describe( "Hex", () => {
		it( "should handle six digit hex values", () => {
			var c = color( "#4682B4" );
			expect( c ).to.deep.equal( {r: 70, g: 130, b: 180, a: 1} );
		} );

		it( "should handle three digit hex values", () => {
			var c = color( "#abc" );
			expect( c ).to.deep.equal( { r: 170, g: 187, b: 204, a: 1 } );
		} );

		it( "should handle white space before and after three digit hex values", () => {
			var c = color( "	 #4682B4 	" );
			expect( c ).to.deep.equal( {r: 70, g: 130, b: 180, a: 1} );
		} );

		it( "should handle white space before and after six digit hex values", () => {
			var c = color( "	 #abc 	" );
			expect( c ).to.deep.equal( { r: 170, g: 187, b: 204, a: 1 } );
		} );

		it( "should not match six digit hex values without #", () => {
			var c = color( "aabbcc" );
			expect( c ).to.equal( undefined );
		} );

		it( "should not match three digit hex values without #", () => {
			var c = color( "abc" );
			expect( c ).to.equal( undefined );
		} );

		it( "should not allow six digit hex values outside of boundry", () => {
			var c = color( "#GGGGGG" );
			expect( c ).to.equal( undefined );
		} );

		it( "should only allow six or three digit hex values", () => {
			var c = color( "#ffff" );
			expect( c ).to.equal( undefined );

			c = color( "#ff" );
			expect( c ).to.equal( undefined );
		} );
	} )

	describe( "Key words", () => {
		it( "should handle key words", () => {
			var c = color( "red" );
			expect( c ).to.deep.equal( {r: 255, g: 0, b: 0, a: 1} );
		} );

		it( "should handle extended key words", () => {
			var c = color( "chocolate" );
			expect( c ).to.deep.equal( { r: 210, g: 105, b: 30, a: 1 } );
		} );

		it( "should handle white space before and after key words", () => {
			var c = color( "	 red 	" );
			expect( c ).to.deep.equal( {r: 255, g: 0, b: 0, a: 1} );
		} );

		it( "should handle case in key words", () => {
			var c = color( "RED" );
			expect( c ).to.deep.equal( {r: 255, g: 0, b: 0, a: 1} );
		} );
	})

	describe("Input handling", () => {
		it( "should handle null", () => {
			var c = color( null );
			expect( c ).to.equal( undefined );
		} );

		it( "should handle undefined", () => {
			var c = color( undefined );
			expect( c ).to.equal( undefined );
		} );

		it( "should handle empty string value", () => {
			var c = color( "" );
			expect( c ).to.equal( undefined );
		} );

		it( "should handle empty value", () => {
			var c = color();
			expect( c ).to.equal( undefined );
		} );
	} )
});
