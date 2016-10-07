import { generateContinuousTicks, generateDiscreteTicks } from "../../../../../src/core/chart-components/axis/axis-tick-generators";
import { continuousDefaultSettings } from "../../../../../src/core/chart-components/axis/axis-default-settings";
import { linear } from "../../../../../src/core/scales/linear";
import { band } from "../../../../../src/core/scales/band";

describe( "Tick generators", () => {
	let settings;
	let scale;

	describe( "continues tick generator", () => {
		let innerRect;
		beforeEach( () => {
			innerRect = { width: 500, height: 100, x: 0, y: 0 };
			settings = continuousDefaultSettings();
			scale = linear();
		} );

		it( "should output ticks in the correct format", () => {
			settings.ticks.count = 2;
			let ticks = generateContinuousTicks( { settings, innerRect, scale } );
			let expected = [
				{ position: 0, label: 0, isMinor: false },
				{ position: 0.5, label: 0.5, isMinor: false },
				{ position: 1, label: 1, isMinor: false }
			];
			expect( ticks ).to.deep.equal( expected );
		} );

		it( "should generate ticks by values", () => {
			settings.ticks.values = [ 0.1, 0.3 ];
			let ticks = generateContinuousTicks( { settings, innerRect, scale } );
			expect( ticks[0].position ).to.equal( 0.1 );
			expect( ticks[1].position ).to.equal( 0.3 );
		} );

		it( "should generate ticks by count", () => {
			settings.ticks.count = 10;
			let ticks = generateContinuousTicks( { settings, innerRect, scale } );
			expect( ticks.length ).to.deep.equal( 11 );
		} );

		it( "should generate ticks by count with minor ticks", () => {
			settings.ticks.count = 5;
			settings.minorTicks.show = true;
			settings.minorTicks.count = 1;
			let ticks = generateContinuousTicks( { settings, innerRect, scale } );
			expect( ticks.length ).to.equal( 11 );
			expect( ticks.filter( ( t ) => { return t.isMinor; } ).length ).to.equal( 5 );
		} );

		it( "should generate ticks by distance, aligned vertically", () => {
			let ticks = generateContinuousTicks( { settings, innerRect, scale } );
			expect( ticks.length ).to.equal( 3 );
		} );

		it( "should generate ticks by distance, aligned horizontally", () => {
			settings.align = "bottom";
			let ticks = generateContinuousTicks( { settings, innerRect, scale } );
			expect( ticks.length ).to.equal( 6 );
		} );

		it( "should generate tight ticks by distance", () => {
			settings.ticks.tight = true;
			let ticks = generateContinuousTicks( { settings, innerRect, scale } );
			expect( ticks[0].label ).to.equal( scale.start() );
			expect( ticks[ticks.length - 1].label ).to.equal( scale.end() );
		} );

		it( "should generate ticks by distance with minor ticks", () => {
			settings.minorTicks.show = true;
			settings.minorTicks.count = 1;
			let ticks = generateContinuousTicks( { settings, innerRect, scale } );
			expect( ticks.length ).to.equal( 3 );
			expect( ticks.filter( ( t ) => { return t.isMinor; } ).length ).to.equal( 1 );
		} );

		it( "should be able to force ticks at bounds", () => {
			settings.ticks.tight = false;
			settings.ticks.forceBounds = true;
			scale.domain( [-99842.82122359527, 99888.12805374675] );
			let ticks = generateContinuousTicks( { settings, innerRect, scale } );
			expect( ticks[0].label ).to.equal( scale.start() );
			expect( ticks[ticks.length - 1].label ).to.equal( scale.end() );
		} );
	} );

	describe( "discrete tick generator", () => {
		let data;

		beforeEach( () => {
			data = [ "d1", "d2", "d3" ];
		} );

		it( "should generate ticks by data", () => {
			scale = band( data, [0, 1] );
			let ticks = generateDiscreteTicks( { data, scale } );
			let expected = [
				{ position: 0, label: "d1" },
				{ position: 0.3333333333333333, label: "d2" },
				{ position: 0.6666666666666666, label: "d3" }
			];
			expect( ticks ).to.deep.equal( expected );
		} );

		it( "should generate ticks by index", () => {
			scale = band( [0, 1, 2], [0, 1] );
			let ticks = generateDiscreteTicks( { data, scale } );
			let expected = [
				{ position: 0, label: "d1" },
				{ position: 0.3333333333333333, label: "d2" },
				{ position: 0.6666666666666666, label: "d3" }
			];
			expect( ticks ).to.deep.equal( expected );
		} );
	} );
} );
