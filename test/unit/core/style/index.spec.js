import { resolveStyle } from "../../../../src/core/style";

describe( "Style resolver", () => {
    let settings;
	beforeEach( () => {
		settings = {
            stroke: "stroke",
            fontSize: "13px",
            style: {
                stroke: function stroke( item, index ) {
                    return index < 2 ? "style.stroke" : null;
                },
                box: {
                    width: 1.2,
                    fill: "rgba(0, 0, 0, 0.2)",
                    opacity: {
                        source: "/qMeasureInfo/1",
                        fn: function fn( index ) {
                            return index > 1 ? 0.5 : null;
                        }
                    }
                },
                whisker: {
                    type: "circle",
                    fill: "red",
                    width: 1
                },
                med: {
                    stroke: "#00f",
                    strokeWidth: 6,
                    fill: 0
                },
                line: {
                    stroke: function stroke( item, index ) {
                        return index < 1 ? "style.line.stroke" : null;
                    },
                    strokeWidth: {
                        fn: function fn( ) {
                            return 5;
                        },
                        source: "/qMeasureInfo/1"
                    },
                    fill: { source: "/qMeasureInfo/0", type: "color" }
                },
                title: {
                    main: {

                    }
                }
            }
        };
	} );

    it( "should resolve existing style", () => {
		let result = resolveStyle( { fill: null }, settings, "style.whisker" );
        expect( result.fill ).to.equal( "red" );
	} );
    it( "should resolve existing 0 style", () => {
		let result = resolveStyle( { fill: 1 }, settings, "style.med" );
        expect( result.fill ).to.equal( 0 );
	} );
    it( "should resolve deep inheritance", () => {
		let result = resolveStyle( { fontSize: null }, settings, "style.title.main" );
        expect( result.fontSize ).to.equal( "13px" );
	} );
    it( "should fallback to inline default", () => {
		let result = resolveStyle( { color: "red" }, settings, "style.title.main" );
        expect( result.color ).to.equal( "red" );
	} );
    it( "should fallback to inline 0 default", () => {
		let result = resolveStyle( { fontSize: 0 }, settings, "style.med" );
        expect( result.fontSize ).to.equal( 0 );
	} );
    it( "should fallback to global default", () => {
		let result = resolveStyle( { color: null }, settings, "style.title.main" );
        expect( result.color ).to.equal( "#595959" );
	} );
    it( "should fallback throught functions", () => {
		let result = resolveStyle( { stroke: null }, settings, "style.line" );
        let output = [0, 1, 2].map( function( item ) {
            return result.stroke.fn( null, item );
        } );
        expect( output ).to.deep.equal( ["style.line.stroke", "style.stroke", "stroke"] );
	} );
    it( "should leave additional properties alone", () => {
		let result = resolveStyle( { strokeWidth: null }, settings, "style.line" );
        expect( result.strokeWidth.source ).to.equal( "/qMeasureInfo/1" );
        expect( result.strokeWidth.fn() ).to.equal( 5 );
	} );
    it( "should add fallback if custom scale", () => {
		let result = resolveStyle( { fill: "filling" }, settings, "style.line" );
        expect( result.fill.source ).to.equal( "/qMeasureInfo/0" );
        expect( result.fill.fn() ).to.equal( "filling" );
	} );
    it( "should add fallback if custom fn", () => {
		let result = resolveStyle( { opacity: "!transparency" }, settings, "style.box" );
        expect( result.opacity.source ).to.equal( "/qMeasureInfo/1" );
        expect( result.opacity.fn( 2 ) ).to.equal( 0.5 );
        expect( result.opacity.fn( 0 ) ).to.equal( "!transparency" );
	} );
} );
