import { default as Straight, create } from "./straight-layout";

let data = {
	qHyperCube: {
		qDimensionInfo: [{
			qMin: 2,
			qMax: 3,
			qStateCounts: {
				qLocked: 1,
				qOption: 2,
				qSelected: 3
			},
			qFallbackTitle: "My Title"
		}],
		qMeasureInfo: [{}, {
			qMin: 130,
			qMax: 170,
			qFallbackTitle: "My Title"
		}],
		qDataPages: [
			{
				qArea: { qTop: 0, qLeft: 0, qWidth: 5, qHeight: 4 },
				qMatrix: []
			}
		]
	}
};

describe( "StraightLayout", () => {
	let s,
		resolve,
		metaToData,
		sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		resolve = sandbox.stub();
		metaToData = sandbox.stub();
		s = new Straight( Promise, resolve, metaToData );
		s.layout( data );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	it( "should be a constructor", () => {
		expect( Straight ).to.be.a( "function" );
		expect( Straight ).to.throw();
	} );

	it( "should have a factory function", () => {
		expect( create() ).to.be.an.instanceof( Straight );
	} );

	it( "should set/get layout", () => {
		expect( s.layout( "a" ) ).to.equal( s );
		expect( s.layout() ).to.equal( "a" );
	} );

	describe( "#dataPages", () => {
		it( "should get pages", ( done ) => {
			s.dataPages().then( ( pages ) => {
				expect( pages ).to.deep.equal( data.qHyperCube.qDataPages );
				done();
			} );
		} );

		it( "should reject when layout is null", done => {
			s.layout( null );
			s.dataPages().catch( () => {
				done();
			} );
		} );
	} );

	describe( "#metaOf", () => {
		it( "should find meta values of dimension", () => {
			resolve.returns( data.qHyperCube.qDimensionInfo[0] );
			let v = s.metaOf( "/foo/boo" );
			expect( resolve ).to.have.been.calledWithExactly( "/foo/boo", data );
			expect( v ).to.deep.equal( { min: 2, max: 3, count: 6, title: "My Title" } );
		} );

		it( "should find meta values of measure", () => {
			resolve.returns( data.qHyperCube.qMeasureInfo[1] );
			let v = s.metaOf( "/foo/boo" );
			expect( resolve ).to.have.been.calledWithExactly( "/foo/boo", data );
			expect( v ).to.deep.equal( { min: 130, max: 170, title: "My Title" } );
		} );
	} );

	describe( "#fromSource", () => {
		it( "should find values to source path", () => {
			let p = "/foo/";
			metaToData.returns( "/magic/qDataPages/" );
			resolve.returns( "values" );

			expect( s.fromSource( p, 3 ) ).to.equal( "values" );
			expect( metaToData ).to.have.been.calledWithExactly( p, data );
			expect( resolve ).to.have.been.calledWithExactly( "/magic/qDataPages/3", data );
		} );

		it( "should find values to an array of source paths", () => {
			let p = ["/foo/"];
			metaToData.returns( "/magic/qDataPages/" );
			resolve.returns( "values" );

			expect( s.fromSource( p, 3 ) ).to.deep.equal( ["values"] );
			expect( metaToData ).to.have.been.calledWithExactly( p[0], data );
			expect( resolve ).to.have.been.calledWithExactly( "/magic/qDataPages/3", data );
		} );
	} );
} );
