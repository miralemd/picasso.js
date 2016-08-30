/**
* HypercubeGenerator
* Ripped apart from sense-client repo
* Originally created by MEK
* Modified by BGE for ES6 & Picasso
*/
import generator from "./hypercube-generator";

let expect = chai.expect;

describe( "Hypercube generator", function () {

	it( "should support generating multiple measures", function () {
		let d = generator.generateDataFromArray( [
			["d", "m", "m", "m"], // field type
			["Year", "Sales", "Cost", "Margin"], // label
			["2008", 1, 2, 3],
			["2009", 2, 1, 3],
			["2010", 1, 2, -1]
		] ), m;

		m = d.qHyperCube.qDataPages[0].qMatrix;

		expect( d.qHyperCube.qDimensionInfo.length ).to.equal( 1 );
		expect( d.qHyperCube.qMeasureInfo.length ).to.equal( 3 );

		expect( d.qHyperCube.qMeasureInfo[0].qMax ).to.equal( 2 );
		expect( d.qHyperCube.qMeasureInfo[2].qMin ).to.equal( -1 );

		expect( m[0][0].qText ).to.equal( "2008" );
		expect( m[2][3].qNum ).to.equal( -1 );
	} );

	it( "should support generating multiple dimensions", function () {
		let d = generator.generateDataFromArray( [
			["d", "d", "m", "m", "m"], // field type
			["Year", "Quarter", "Sales", "Cost", "Margin"], // label
			["2008", "Q1", 1, 2, -1],
			["2008", "Q2", 2, 3, -2],
			["2008", "Q3", 3, 4, -3],
			["2008", "Q4", 1, 2, -4],
			["2009", "Q1", 2, 1, 2],
			["2009", "Q2", 0, 1, 0],
			["2009", "Q3", 2, 1, 0],
			["2009", "Q4", 5, 1, 3]
		] );

		expect( d.qHyperCube.qDimensionInfo.length ).to.equal( 2 );
		expect( d.qHyperCube.qDimensionInfo[0].qFallbackTitle ).to.equal( "Year" );
		expect( d.qHyperCube.qDimensionInfo[0].qApprMaxGlyphCount ).to.equal( 4 );
		expect( d.qHyperCube.qDimensionInfo[0].qCardinal ).to.equal( 2 );

		expect( d.qHyperCube.qDimensionInfo[1].qFallbackTitle ).to.equal( "Quarter" );
		expect( d.qHyperCube.qDimensionInfo[1].qApprMaxGlyphCount ).to.equal( 2 );
		expect( d.qHyperCube.qDimensionInfo[1].qCardinal ).to.equal( 4 );

		expect( d.qHyperCube.qMeasureInfo.length ).to.equal( 3 );
		expect( d.qHyperCube.qMeasureInfo[0].qMax ).to.equal( 5 );
		expect( d.qHyperCube.qMeasureInfo[2].qMin ).to.equal( -4 );
	} );

} );
