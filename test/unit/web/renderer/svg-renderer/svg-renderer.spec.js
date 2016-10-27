import { renderer } from "../../../../../src/web/renderer/svg-renderer/svg-renderer";
import element from "../../../../mocks/element-mock";


describe( "svg renderer", () => {
	let sandbox, tree, ns, treeRenderer, svg, scene, Prom;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		Prom = {
			resolve: sandbox.spy(),
			reject: sandbox.spy()
		};
		treeRenderer = {
			render: sandbox.spy()
		};
		scene = sandbox.stub();
		tree = sandbox.stub().returns( treeRenderer );
		ns = "namespace";
		svg = renderer( tree, ns, scene, Prom );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	it( "should be a function", () => {
		expect( renderer ).to.be.a( "function" );
	} );

	describe( "appendTo", () => {
		it( "should append root node to element", () => {
			let el = element( "div" );
			svg.appendTo( el );

			expect( svg.element().name ).to.equal( "namespace:svg" );
			expect( svg.element().parentElement ).to.equal( el );
		} );

		it( "should not create new root if it already exists", () => {
			let el = element( "div" ),
				el2 = element( "div" );
			svg.appendTo( el );
			let svgEl = svg.element();
			svg.appendTo( el2 );

			expect( svg.element() ).to.equal( svgEl );
		} );
	} );

	describe( "render", () => {
		let items, s;

		beforeEach( () => {
			items = ["a"];
			s = { children: ["AA"] };
		} );

		it( "should reject promise when rendering before appending", () => {
			svg.render();
			expect( Prom.reject.callCount ).to.equal( 1 );
		} );

		it( "should call tree creator with proper params", () => {
			scene.returns( s );
			svg.appendTo( element( "div" ) );
			svg.render( items );
			expect( scene.args[0][0] ).to.equal( items );
			expect( treeRenderer.render ).to.have.been.calledWith( s.children, svg.root() );
		} );

		it( "should attach to given position in the container", () => {
			scene.returns( s );
			svg.appendTo( element( "div" ) );
			svg.size( { x: 50, y: 100, width: 200, height: 400 } );
			svg.render( items );

			let el = svg.element();
			expect( el.style.position ).to.equal( "absolute" );
			expect( el.style.left ).to.equal( "50px" );
			expect( el.style.top ).to.equal( "100px" );
			expect( el.attributes.width ).to.equal( 200 );
			expect( el.attributes.height ).to.equal( 400 );
		} );
	} );

	describe( "clear", () => {
		it( "should remove all elements", () => {
			svg.appendTo( element( "div" ) );
			svg.root().appendChild( element( "circle" ) );
			svg.root().appendChild( element( "rect" ) );
			expect( svg.root().children.length ).to.equal( 2 );

			svg.clear();

			expect( svg.root().children.length ).to.equal( 0 );
		} );
	} );

	describe( "destroy", () => {
		it( "should detach root from its parent", () => {
			let parent = element( "div" );
			svg.appendTo( parent );
			expect( svg.element().parentElement ).to.equal( parent );
			svg.destroy();

			expect( svg.element() ).to.equal( null );
			expect( parent.children.length ).to.equal( 0 );
		} );

		it( "should not throw error if root does not exist", () => {
			let fn = () => {
				svg.destroy();
			};
			expect( fn ).to.not.throw();
		} );
	} );

	describe( "size", () => {
		it( "should return current size if no parameters are given", () => {
			svg.appendTo( element( "div" ) );
			svg.size( { x: 50, y: 100, width: 200, height: 400 } );
			expect( svg.size() ).to.deep.equal( { x: 50, y: 100, width: 200, height: 400 } );
		} );
	} );
} );
