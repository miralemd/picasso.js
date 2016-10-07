import { abstractAxis } from "../../../../../src/core/chart-components/axis/axis";
import { linear } from "../../../../../src/core/scales/linear";
import { band } from "../../../../../src/core/scales/band";

describe( "Axis", () => {
	let composerMock;
	let config;
	let rendererMock;
	let axis;

	function verifyNumberOfNodes( tNodes, lNodes ) {
		let nodes = rendererMock.render.args[0][0];
		let textNodes = nodes.filter( ( n ) => n.type === "text" );
		let lineNodes = nodes.filter( ( n ) => n.type === "line" );
		expect( textNodes.length, "Unexpected number of text nodes" ).to.equal( tNodes );
		expect( lineNodes.length, "Unexpected number of line nodes" ).to.equal( lNodes );
	}

	beforeEach( () => {

		composerMock = {
			scales: {
				y: {
					source: "source"
				}
			},
			data: {}
		};

		config = {
			scale: "y",
			settings: {}
		};

		rendererMock = {
			size: () => { return { width: 100, height: 100 }; },
			render: sinon.spy(),
			measureText: ( { text } ) => { return { width: text.toString().length, height: 5 }; }
		};
	} );

	describe( "continuous", () => {

		beforeEach( () => {
			composerMock.scales.y.scale = linear();
			composerMock.scales.y.type = "linear";

			axis = abstractAxis( config, composerMock, rendererMock );
		} );

		["left", "right", "top", "bottom" ].forEach( ( d ) => {
			it( `should align to ${d}`, () => {
				config.settings.align = d;
				axis().render();
				verifyNumberOfNodes( 3, 4 );
			} );
		} );

		it( "should not render labels when disabled", () => {
			config.settings.labels = { show: false };
			axis().render();
			verifyNumberOfNodes( 0, 4 );
		} );

		it( "should not render axis line when disabled", () => {
			config.settings.line = { show: false };
			axis().render();
			verifyNumberOfNodes( 3, 3 );
		} );

		it( "should not render ticks when disabled", () => {
			config.settings.ticks = { show: false };
			axis().render();
			verifyNumberOfNodes( 3, 1 );
		} );

		it( "should render a custom number of ticks", () => {
			config.settings.ticks = { count: 5 };
			axis().render();
			verifyNumberOfNodes( 6, 7 );
		} );

		it( "should render minor ticks", () => {
			config.settings.minorTicks = { show: true, count: 2 };
			axis().render();
			verifyNumberOfNodes( 2, 7 );
		} );

		it( "should extend domain of scale with custom min/max values", () => {
			config.settings.ticks = { min: -10, max: 10 };
			axis().render();
			const actualMin = composerMock.scales.y.scale.start();
			const actualMax = composerMock.scales.y.scale.end();
			expect( actualMin ).to.equal( -10 );
			expect( actualMax ).to.equal( 10 );
		} );

		it( "should not extend domain based on tight ticks generation if custom min/max values are set", () => {
			config.settings.ticks = { min: -10, max: 400 };
			config.settings.ticks.tight = true;
			axis().render();
			const actualMin = composerMock.scales.y.scale.start();
			const actualMax = composerMock.scales.y.scale.end();
			expect( actualMin ).to.equal( -10 );
			expect( actualMax ).to.equal( 400 );
		} );
	} );

	describe( "discrete", () => {
		let data;
		let dataMapperMock;

		beforeEach( () => {
			data = ["d1", "d2", "d3"];
			composerMock.data = data;
			composerMock.scales.y.scale = band( [0, 1, 2], [0, 1] );
			composerMock.scales.y.type = "ordinal";
			dataMapperMock = () => { return data; };
			axis = abstractAxis( config, composerMock, rendererMock );
		} );

		["left", "right", "top", "bottom" ].forEach( ( d ) => {
			it( `should align to ${d}`, () => {
				config.settings.align = d;
				axis( dataMapperMock ).render();
				verifyNumberOfNodes( 3, 4 );
			} );
		} );

		["top", "bottom" ].forEach( ( d ) => {
			it( `should support layered labels for ${d} aligned axis`, () => {
				config.settings.align = d;
				config.settings.labels = { layered: true };
				axis( dataMapperMock ).render();
				verifyNumberOfNodes( 3, 4 );
			} );
		} );
	} );
} );
