import LinearScale from "./linear";

describe( "LinearScale", () => {
	let lin;
	beforeEach( () => {
		lin = new LinearScale();
	} );

	it( "should have 0-1 as defaults", () => {
		expect( lin.min ).to.equal( 0 );
		expect( lin.max ).to.equal( 1 );
	} );

	it( "should accept domain and output parameters", () => {
		lin = new LinearScale( [1, 3], [-1, 1] );
		expect( lin.min ).to.equal( 1 );
		expect( lin.max ).to.equal( 3 );
		expect( lin.output ).to.deep.equal( [-1, 1] );
	} );

	it( "should have min/max depend on domain", () => {
		lin.from( [-13, 17] );
		expect( lin.min ).to.equal( -13 );
		expect( lin.max ).to.equal( 17 );
	} );

	it( "should have start/end depend on domain", () => {
		lin.from( [-10, 5, 0, 1] ).to( [1, 2, 3, 4] );
		expect( lin.start ).to.equal( -10 );
		expect( lin.end ).to.equal( 1 );
	} );

	it( "should have start/end depend on extended domain", () => {
		lin.from( [-10, 5, 0, 1] ).to( [1, 2, 3, 4] );
		expect( lin.start ).to.equal( -10 );
		expect( lin.end ).to.equal( 1 );
	} );

	it( "should return a linearly interpolated value", () => {
		lin.from( [-10, 10] ).to( [10, 20] );
		expect( lin.get( -10 ) ).to.equal( 10 );
		expect( lin.get( 10 ) ).to.equal( 20 );
		expect( lin.get( 0 ) ).to.equal( 15 );
	} );

	it( "should return a linearly interpolated value with negative range", () => {
		lin.from( [10, -10] ).to( [100, 200] );
		expect( lin.get( 10 ) ).to.equal( 100 );
		expect( lin.get( -10 ) ).to.equal( 200 );
		expect( lin.get( 2 ) ).to.equal( 140 );
	} );

	it( "should support piecewise linear values", () => {
		lin.from( [5, 10, 20] ).to( [1, 0, -5] );
		expect( lin.get( 5 ) ).to.equal( 1 );
		expect( lin.get( 10 ) ).to.equal( 0 );
		expect( lin.get( 20 ) ).to.equal( -5 );

		expect( lin.get( 0 ) ).to.equal( 2 );
		expect( lin.get( 30 ) ).to.equal( -10 );
	} );

	it( "should support piecewise linear values with negative range", () => {
		lin.from( [10, 5, 0, -1] ).to( [100, 200, 300, 400] );
		expect( lin.get( 10 ) ).to.equal( 100 );
		expect( lin.get( 6 ) ).to.equal( 180 );
		expect( lin.get( 4 ) ).to.equal( 220 );
		expect( lin.get( -0.5 ) ).to.equal( 350 );

		expect( lin.get( 15 ) ).to.equal( 0 );
		expect( lin.get( -2 ) ).to.equal( 500 );
	} );

	it( "should generate nice ticks when a ticker is provided", () => {
		let ticker = {
			generateTicks: sinon.stub()
		};
		ticker.generateTicks.returns( {start: 6, end: 1, ticks: [4, 3, 2, 1] });

		lin = new LinearScale( [20, 10], [60, 40], ticker );
		expect( ticker.generateTicks ).to.have.been.calledWithExactly( 20, 10, 2 );
		expect( lin.min ).to.equal( 1 );
		expect( lin.max ).to.equal( 6 );

		expect( lin.start ).to.equal( 6 );
		expect( lin.end ).to.equal( 1 );
	} );

	it( "should recalculate ticks when changing input range", () => {
		lin.ticker = {
			generateTicks: sinon.stub()
		};
		lin.ticker.generateTicks.returns( {start: -3, end: 5, ticks: [-1, 0, 1, 2]} );
		lin.nTicks = 7;
		lin.from( [-4, 5] );
		expect( lin.ticker.generateTicks ).to.have.been.calledWithExactly( -4, 5, 7 );
		expect( lin.min ).to.equal( -3 );
		expect( lin.max ).to.equal( 5 );
	} );

	it( "should support grouping values", () => {
		lin.from( [-10, 10] ).to( [-100, 100] ).classify( 5 );
		expect( lin.inputDomain.length ).to.equal( 10 );
		expect( lin.output.length ).to.equal( 10 );
		expect( lin.get( -10 ) ).to.equal( -80 );
		expect( lin.get( 10 ) ).to.equal( 80 );
	} );

	it( "should support grouping negative values", () => {
		lin.from( [-20, -10] ).to( [-200, -100] ).classify( 2 );
		expect( lin.inputDomain.length ).to.equal( 4 );
		expect( lin.output.length ).to.equal( 4 );
		expect( lin.get( -20 ) ).to.equal( -175 );
		expect( lin.get( -10 ) ).to.equal( -125 );
	} );

	it( "should support grouping a negative value range", () => {
		lin.from( [10, -10] ).to( [-100, 100] ).classify( 2 );
		expect( lin.inputDomain.length ).to.equal( 4 );
		expect( lin.output.length ).to.equal( 4 );
		expect( lin.get( 10 ) ).to.equal( -50 );
		expect( lin.get( -10 ) ).to.equal( 50 );
	} );
} );
