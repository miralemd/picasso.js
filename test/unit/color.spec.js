import { default as color } from "../../src/colors/color";

describe( "Colors", () => {

	describe( "HSL", () => {
		it( "should handle hsl values", () => {
			let c = color( "hsl(180,100%,50%)" );
			expect( c ).to.deep.equal( {h: 180, s: 1, l: 0.5, a: 1} );
		} );

		it( "should handle hsla values", () => {
			let c = color( "hsla(180, 100% ,50%, 0.5)" );
			expect( c ).to.deep.equal( {h: 180, s: 1, l: 0.5, a: 0.5} );
		} );

		it( "should normalize angle values", () => {
			let c = color( "hsla(-120, 100% ,50%, 0.5)" );
			expect( c ).to.deep.equal( {h: 240, s: 1, l: 0.5, a: 0.5} );

			c = color( "hsla(480, 100% ,50%, 0.5)" );
			expect( c ).to.deep.equal( {h: 120, s: 1, l: 0.5, a: 0.5} );
		} );

		it( "should clip percentage values", () => {
			let c = color( "hsla(180, 101% ,101%, 1)" );
			expect( c ).to.deep.equal( {h: 180, s: 1, l: 1, a: 1} );
		} );

		it( "should clip negative percentage values", () => {
			let c = color( "hsla(180, -1% ,-1%, 1)" );
			expect( c ).to.deep.equal( {h: 180, s: 0, l: 0, a: 1} );
		} );

		it( "should clip alpha value", () => {
			let c = color( "hsla(255, 100%, 50%, 10.10)" );
			expect( c ).to.deep.equal( {h: 255, s: 1, l: 0.5, a: 1} );
		} );

		it( "should allow decimal values and round to nearest integer", () => {
			let c = color( "hsla(180.6, 11.6% , 19.6%, 1)" );
			expect( c ).to.deep.equal( {h: 181, s: 0.12, l: 0.2, a: 1} );

			c = color( "hsl(180.6, 11.6% , 19.6%)" );
			expect( c ).to.deep.equal( {h: 181, s: 0.12, l: 0.2, a: 1} );
		} );

		it( "should not allow saturation and lightness values without a percentage character", () => {
			let c = color( "hsla(18, 1 , 0.5, 1)" );
			expect( c ).to.deep.equal( undefined );

			c = color( "hsl(18, 1 , 1)" );
			expect( c ).to.deep.equal( undefined );
		} );

		it( "should use percentage in string output", () => {
			let c = color( "hsl(230, 100% ,50%)" ).toString();
			expect( c ).to.equal( "hsla(230, 100%, 50%, 1)" );

			c = color( "hsla(230, 100% ,50%, 0.5)" ).toString();
			expect( c ).to.equal( "hsla(230, 100%, 50%, 0.5)" );
		} );

		it( "should not allow non-digit characters", () => {
			let c = color( "hsla(a,b,c,d)" );
			expect( c ).to.equal( undefined );

			c = color( "hsl(a,b,c)" );
			expect( c ).to.equal( undefined );
		} );

		it( "should handle whitespace", () => {
			let c = color( " hsla( 120 , 100% , 50% , 0.5 ) " );
			expect( c ).to.deep.equal( {h: 120, s: 1, l: 0.5, a: 0.5} );

			c = color( " hsla( 80 , 100% , 50% , 0.5 ) " );
			expect( c ).to.deep.equal( {h: 80, s: 1, l: 0.5, a: 0.5} );
		} );
	} );

	describe( "RGB", () => {
		it( "should handle rgb numerical values", () => {
			let c = color( "rgb(3,33,99)" );
			expect( c ).to.deep.equal( {r: 3, g: 33, b: 99, a: 1} );
		} );

		it( "should handle rgba numerical values", () => {
			let c = color( "rgba(3,33,99,0.1)" );
			expect( c ).to.deep.equal( {r: 3, g: 33, b: 99, a: 0.1} );
		} );

		it( "should handle rgb percentage values", () => {
			let c = color( "rgb(3%,33%,99%)" );
			expect( c ).to.deep.equal( {r: 8, g: 84, b: 252, a: 1} );
		} );

		it( "should handle rgba percentage values", () => {
			let c = color( "rgba(3%,33%,99%,0.5)" );
			expect( c ).to.deep.equal( {r: 8, g: 84, b: 252, a: 0.5} );
		} );

		it( "should clip numerical values", () => {
			let c = color( "rgba(256,256,256,1)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( "rgb(256,256,256)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );
		} );

		it( "should clip negative numerical values", () => {
			let c = color( "rgba(-1,-1,-1,1)" );
			expect( c ).to.deep.equal( {r: 0, g: 0, b: 0, a: 1} );

			c = color( "rgb(-1,-1,-1)" );
			expect( c ).to.deep.equal( {r: 0, g: 0, b: 0, a: 1} );
		} );

		it( "should clip percentage values", () => {
			let c = color( "rgba(101%,101%,101%,1)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( "rgb(101%,101%,101%)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );
		} );

		it( "should clip alpha value", () => {
			let c = color( "rgba(255, 255, 255, 10.10)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );
		} );

		it( "should handle numerical boundry values", () => {
			let c = color( "rgb(255,255,255)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( "rgb(0, 0, 0)" );
			expect( c ).to.deep.equal( {r: 0, g: 0, b: 0, a: 1} );
		} );

		it( "should handle percentage boundry values", () => {
			let c = color( "rgb(100%,100%,100%)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( "rgb(0%,0%,0%)" );
			expect( c ).to.deep.equal( {r: 0, g: 0, b: 0, a: 1} );
		} );

		it( "should handle whitespace", () => {
			let c = color( " rgb( 100% , 100% , 100% ) " );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );

			c = color( " rgba( 255 , 255 , 255 , 1 ) " );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 1} );
		} );

		it( "should clip negative alpha values", () => {
			let c = color( "rgba(255,255,255,-1)" );
			expect( c ).to.deep.equal( {r: 255, g: 255, b: 255, a: 0} );
		} );

		it( "should not allow non-digit characters", () => {
			let c = color( "rgba(a,b,c,d)" );
			expect( c ).to.deep.equal( undefined );

			c = color( "rgb(a,b,c)" );
			expect( c ).to.deep.equal( undefined );
		} );

		it( "should not allow mixing numerial and percentage values", () => {
			let c = color( "rgba(255,10%,123,1)" );
			expect( c ).to.deep.equal( undefined );

			c = color( "rgb(123,55%,90%)" );
			expect( c ).to.deep.equal( undefined );
		} );

		it( "should not allow decimal values", () => {
			let c = color( "rgba(25.5, 99.9, 0.1, 1)" );
			expect( c ).to.deep.equal( undefined );

			c = color( "rgb(25.5, 99.9, 0.1)" );
			expect( c ).to.deep.equal( undefined );

			c = color( "rgba(25.5%, 99.9%, 0.1%, 1)" );
			expect( c ).to.deep.equal( undefined );

			c = color( "rgb(25.5%, 99.9%, 0.1%)" );
			expect( c ).to.deep.equal( undefined );
		} );
	} );

	describe( "Hex", () => {
		it( "should handle six digit hex values", () => {
			let c = color( "#4682B4" );
			expect( c ).to.deep.equal( {r: 70, g: 130, b: 180, a: 1} );
		} );

		it( "should handle three digit hex values", () => {
			let c = color( "#abc" );
			expect( c ).to.deep.equal( { r: 170, g: 187, b: 204, a: 1 } );
		} );

		it( "should handle white space before and after three digit hex values", () => {
			let c = color( "	 #4682B4 	" );
			expect( c ).to.deep.equal( {r: 70, g: 130, b: 180, a: 1} );
		} );

		it( "should handle white space before and after six digit hex values", () => {
			let c = color( "	 #abc 	" );
			expect( c ).to.deep.equal( { r: 170, g: 187, b: 204, a: 1 } );
		} );

		it( "should not match six digit hex values without #", () => {
			let c = color( "aabbcc" );
			expect( c ).to.equal( undefined );
		} );

		it( "should not match three digit hex values without #", () => {
			let c = color( "abc" );
			expect( c ).to.equal( undefined );
		} );

		it( "should not allow six digit hex values outside of boundry", () => {
			let c = color( "#GGGGGG" );
			expect( c ).to.equal( undefined );
		} );

		it( "should only allow six or three digit hex values", () => {
			let c = color( "#ffff" );
			expect( c ).to.equal( undefined );

			c = color( "#ff" );
			expect( c ).to.equal( undefined );
		} );
	} );

	describe( "Key words", () => {
		it( "should handle key words", () => {
			let c = color( "red" );
			expect( c ).to.deep.equal( {r: 255, g: 0, b: 0, a: 1} );
		} );

		it( "should handle extended key words", () => {
			let c = color( "chocolate" );
			expect( c ).to.deep.equal( { r: 210, g: 105, b: 30, a: 1 } );
		} );

		it( "should handle white space before and after key words", () => {
			let c = color( "	 red 	" );
			expect( c ).to.deep.equal( {r: 255, g: 0, b: 0, a: 1} );
		} );

		it( "should handle case in key words", () => {
			let c = color( "RED" );
			expect( c ).to.deep.equal( {r: 255, g: 0, b: 0, a: 1} );
		} );
	} );

	describe("Input handling", () => {
		it( "should handle null", () => {
			let c = color( null );
			expect( c ).to.equal( undefined );
		} );

		it( "should handle undefined", () => {
			let c = color( undefined );
			expect( c ).to.equal( undefined );
		} );

		it( "should handle empty string value", () => {
			let c = color( "" );
			expect( c ).to.equal( undefined );
		} );

		it( "should handle empty value", () => {
			let c = color();
			expect( c ).to.equal( undefined );
		} );
	} );

	describe( "Color convertions", () => {

		it( "should convert HSL to RGB", () => {
			let c = color( "hsl(180, 100%, 50%)" );
			expect( c.toRGB() ).to.equal( "rgb(0, 255, 255)" );
		} );

		it( "should convert HSL to RGB, s=0%", () => {
			let c = color( "hsl(180, 0%, 50%)" );
			expect( c.toRGB() ).to.equal( "rgb(128, 128, 128)" );
		} );

		it( "should convert HSLA to RGBA", () => {
			let c = color( "hsla(480, 100% ,50%, 0.8)" );
			expect( c.toRGBA() ).to.equal( "rgba(0, 255, 0, 0.8)" );
		} );

		it( "should convert HSLA to HSL", () => {
			let c = color( "hsla(180, 100%, 50%, 0.5)" );
			expect( c.toHSL() ).to.equal( "hsl(180, 100%, 50%)" );
		} );

		it( "should convert HSLA to HSLA", () => {
			let c = color( "hsla(180, 100%, 50%, 0.5)" );
			expect( c.toHSLA() ).to.equal( "hsla(180, 100%, 50%, 0.5)" );
		} );


		it( "should convert RGB to HSL", () => {
			let c = color( "rgb(3, 33, 99)" );
			expect( c.toHSL() ).to.equal( "hsl(221, 94%, 20%)" );
		} );

		it( "should convert RGBA to HSLA", () => {
			let c = color( "rgba(3, 33, 99, 0.1)" );
			expect( c.toHSLA() ).to.equal( "hsla(221, 94%, 20%, 0.1)" );
		} );

		it( "should convert RGB to HSLA", () => {
			let c = color( "rgba(3, 33, 99, 0.1)" );
			expect( c.toHSLA() ).to.equal( "hsla(221, 94%, 20%, 0.1)" );
		} );

		it( "should convert RGBA to RGB", () => {
			let c = color( "rgba(255,255,255, 0.9)" );
			expect( c.toRGB() ).to.equal( "rgb(255, 255, 255)" );
		} );

		it( "should convert RGBA to RGBA", () => {
			let c = color( "rgba(255,255,255, 0.9)" );
			expect( c.toRGBA() ).to.equal( "rgba(255, 255, 255, 0.9)" );
		} );

		it( "should convert RGBA to HEX", () => {
			let c = color( "rgba(255,255,0,1)" );
			expect( c.toHex() ).to.equal( "#ffff00" );
		} );

		it( "should calculate luminance for RGBA color", () => {
			let c = color( "rgba(255,255,0,1)" );
			expect( c.getLuminance() ).to.equal( 0.94 );
		} );

		//it( "should blend RGBA colors", () => {
		//	let c1 = color( "rgba(52,247,247,1)" );
		//	let c2 = color( "rgba(24,24,255,1)" );
		//	expect( c1.blend( c2 ) ).to.equal( "rgb(72, 161, 251)" );
		//} );
	} );

});
