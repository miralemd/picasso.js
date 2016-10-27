import {
	pointFn
} from "../../../../../src/core/chart-components/markers/point";

describe( "point marker", () => {
	let point, renderer, renderedPoints, composer;

	beforeEach( () => {
		let shape = ( type, p ) => { p.type = type; return p; };
		renderer = {
			appendTo: () => {},
			render: ( p ) => ( renderedPoints = p ),
			size: () => {}
		};
		let renderFn = () => renderer;
		let table = {
			findField: sinon.stub()
		};
		composer = {
			container: () => ( {} ),
			table: () => table,
			scale: sinon.stub()
		};
		point = pointFn( renderFn, shape );
	} );

	it( "should create a function object", () => {
		expect( point ).to.be.a( "function" );
	} );

	it( "should render points with default settings", () => {
		let config = {
			data: { source: "foo" }
		};
		composer.table().findField.returns( {
		   values: () => [
			   { value: 1, label: "a" }
		   ]
		} );
		point( config, composer );
		point.resize( { x: 10, y: 20, width: 100, height: 200 } );
		point.render();
		expect( renderedPoints ).to.deep.equal( [{
			type: "circle",
			label: "",
			x: 50,
			y: 100,
			fill: "#999",
			size: 10,
			stroke: "#ccc",
			strokeWidth: 0,
			opacity: 1
		}] );
	} );

	it( "should render points with default settings when input is invalid", () => {
		let config = {
			data: { source: "foo" },
			settings: {
				shape: 1,
				label: true,
				fill: 123,
				stroke: { },
				strokeWidth: undefined,
				opacity: "red",
				x: false,
				y: /12345/,
				size: {}
			}
		};
		composer.table().findField.returns( {
		   values: () => [
			   { value: 1, label: "a" }
		   ]
		} );
		point( config, composer );
		point.resize( { x: 10, y: 20, width: 100, height: 200 } );
		point.render();
		expect( renderedPoints ).to.deep.equal( [{
			type: "circle",
			label: "",
			x: 50,
			y: 100,
			fill: "#999",
			size: 10,
			stroke: "#ccc",
			strokeWidth: 0,
			opacity: 1
		}] );
	} );


	it( "should render points with primitive value settings", () => {
		let config = {
			data: { source: "foo" },
			settings: {
				shape: "rect",
				label: "etikett",
				fill: "red",
				stroke: "blue",
				strokeWidth: 2,
				opacity: 0.7,
				x: 0.8,
				y: 0.3,
				size: 4
			}
		};
		composer.table().findField.returns( {
		   values: () => [
			   { value: 1, label: "a" }
		   ]
		} );
		point( config, composer );
		point.resize( { x: 10, y: 20, width: 100, height: 200 } );
		point.render();
		expect( renderedPoints ).to.deep.equal( [{
			type: "rect",
			label: "etikett",
			x: 80,
			y: 60,
			fill: "red",
			size: 34,
			stroke: "blue",
			strokeWidth: 2,
			opacity: 0.7
		}] );
	} );

	it( "should render points with function settings", () => {
		let config = {
			data: { source: "foo" },
			settings: {
				shape: ( d ) => d.label,
				label: () => "etikett",
				fill: () => "red",
				stroke: () => "blue",
				strokeWidth: () => 2,
				opacity: () => 0.7,
				x: () => 0.8,
				y: () => 0.3,
				size: () => 4
			}
		};
		composer.table().findField.returns( {
		   values: () => [
			   { value: 1, label: "a" }
		   ]
		} );
		point( config, composer );
		point.resize( { x: 10, y: 20, width: 100, height: 200 } );
		point.render();
		expect( renderedPoints ).to.deep.equal( [{
			type: "a",
			label: "etikett",
			x: 80,
			y: 60,
			fill: "red",
			size: 34,
			stroke: "blue",
			strokeWidth: 2,
			opacity: 0.7
		}] );
	} );

	it( "should render points with data settings", () => {
		let config = {
			data: { source: "foo" },
			settings: {
				shape: { source: "shapes", fn: s => s },
				label: { source: "labels", fn: s => s },
				fill: { source: "fill", fn: s => s },
				stroke: { source: "fill", fn: s => `stroke:${s}` },
				strokeWidth: { source: "measure 1", fn: v => v },
				opacity: { source: "measure 1", fn: v => v / 10 },
				x: { source: "measure 2", fn: v => v },
				y: { source: "measure 3", fn: v => v },
				size: { source: "measure 1", fn: ( v, i ) => i }
			}
		};
		composer.table().findField.withArgs( "foo" ).returns( { values: () => ["data 1", "data 2"] } );

		composer.table().findField.withArgs( "shapes" ).returns( { values: () => ["circle", "rect"] } );
		composer.table().findField.withArgs( "labels" ).returns( { values: () => ["etta", "tvåa"] } );
		composer.table().findField.withArgs( "fill" ).returns( { values: () => ["red", "green"] } );
		composer.table().findField.withArgs( "measure 1" ).returns( { values: () => [5, 4] } );
		composer.table().findField.withArgs( "measure 2" ).returns( { values: () => [-0.2, 0.7] } );
		composer.table().findField.withArgs( "measure 3" ).returns( { values: () => [0.3, 1.2] } );

		point( config, composer );
		point.resize( { x: 10, y: 20, width: 100, height: 200 } );
		point.render();
		expect( renderedPoints ).to.deep.equal( [{
			type: "circle",
			label: "etta",
			x: -0.2 * 100,
			y: 0.3 * 200,
			fill: "red",
			size: 2, // min value of [2,10]
			stroke: "stroke:red",
			strokeWidth: 5,
			opacity: 0.5
		}, {
			type: "rect",
			label: "tvåa",
			x: 0.7 * 100,
			y: 1.2 * 200,
			fill: "green",
			size: 10, // max value of [2,10]
			stroke: "stroke:green",
			strokeWidth: 4,
			opacity: 0.4
		}] );
	} );

	it( "should render points with limited size when using discrete scale", () => {
		let config = {
			data: { source: "foo" },
			settings: {
				x: { source: "measure 1" },
				size: { source: "measure 1", fn: v => v }
			}
		};
		composer.table().findField.withArgs( "foo" ).returns( { values: () => ["data 1", "data 2", "data 3"] } );
		composer.table().findField.withArgs( "measure 1" ).returns( { values: () => [0, 0.4, 1] } );
		let xScale = ( v ) => v;
		xScale.scale = { step: () => 0.2 }; // max size: width * 0.2 -> 20
		composer.scale.onCall( 0 ).returns( xScale );

		point( config, composer );
		point.resize( { x: 10, y: 20, width: 100, height: 200 } ); // point size limits: [5,20]
		point.render();

		expect( renderedPoints.map( p => p.size ) ).to.deep.equal( [5, 5 + 15 * 0.4, 20] );
	} );
} );
