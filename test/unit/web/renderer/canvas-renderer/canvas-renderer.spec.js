import { renderer } from "../../../../../src/web/renderer/canvas-renderer";
import element from "../../../../mocks/element-mock";

describe( "canvas renderer", () => {
	let sandbox,
		r,
		Prom,
		scene;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		Prom = {
			resolve: sandbox.stub(),
			reject: sandbox.stub()
		};
		scene = sandbox.stub();
		r = renderer( scene, Prom );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	it( "should append canvas element", () => {
		let div = element( "div" );
		let spy = sandbox.spy( div, "appendChild" );
		r.appendTo( div );
		expect( spy.args[0][0].name ).to.equal( "canvas" );
	} );

	it( "should return rejected promise when no canvas is initiated", () => {
		r.render();
		expect( Prom.reject.callCount ).to.equal( 1 );
	} );

	it( "should return resolved promise when canvas exists", () => {
		r.appendTo( element( "div" ) );
		scene.returns( { children: [] } );
		r.render();
		expect( Prom.resolve.callCount ).to.equal( 1 );
	} );

	it( "should return zero size when canvas is not initiated", () => {
		expect( r.size() ).to.deep.equal( { width: 0, height: 0 } );
	} );

	it( "should return size when canvas is initiated", () => {
		let div = element( "div" );
		div.clientWidth = 50;
		div.clientHeight = 100;
		r.appendTo( div );
		expect( r.size() ).to.deep.equal( { width: 50, height: 100 } );
	} );

	it( "should detach from parent element when destoyed", () => {
		let div = element( "div" );
		r.appendTo( div );
		expect( div.children.length ).to.equal( 1 );
		r.destroy();
		expect( div.children.length ).to.equal( 0 );
	} );
} );
