import LinearScale from "../../src/scales/linear";

describe( "LinearScale", () => {
	let lin;
	beforeEach( () => {
		lin = new LinearScale();
	} );

	it( "should have 0 as defaults", () => {
		expect( lin.min ).to.equal( 0 );
		expect( lin.max ).to.equal( 0 );
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

	it( "should return a linearly interpolated value", () => {
		lin.from( [-10, 10] ).to( [10, 20] );
		expect( lin.get( -10 ) ).to.equal( 10 );
		expect( lin.get( 10 ) ).to.equal( 20 );
		expect( lin.get( 0 ) ).to.equal( 15 );
	} );

	it( "should return a linearly interpolated value", () => {
		lin.from( [-10, 10] ).to( [10, 20] );
		expect( lin.get( -10 ) ).to.equal( 10 );
		expect( lin.get( 10 ) ).to.equal( 20 );
		expect( lin.get( 0 ) ).to.equal( 15 );
	} );

	it( "should generate nice ticks when a ticker is provided", () => {
		let ticker = {
			generateTicks: sinon.stub()
		};
		ticker.generateTicks.returns( [1, 2, 3, 4] );

		lin = new LinearScale( [10, 20], [40, 60], ticker );
		expect( ticker.generateTicks ).to.have.been.calledWithExactly( 10, 20, 6 );
		expect( lin.min ).to.equal( 1 );
		expect( lin.max ).to.equal( 4 );
	} );

	it( "should recalculate ticks when changing input range", () => {
		lin.ticker = {
			generateTicks: sinon.stub()
		};
		lin.ticker.generateTicks.returns( [-1, 0, 1, 2] );
		lin.from( [-4, 5] );
		expect( lin.ticker.generateTicks ).to.have.been.calledWithExactly( -4, 5, 6 );
		expect( lin.min ).to.equal( -1 );
		expect( lin.max ).to.equal( 2 );
	} );
} );
