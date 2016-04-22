import SVGRenderer from "./svg-renderer";
import element from "../../../../test/mocks/element-mock";


describe( "SVGRenderer", () => {
	let creator, maintainer, destroyer, svg, sandbox, treeCreator;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		treeCreator = sandbox.spy();
		creator = sandbox.spy();
		maintainer = sandbox.spy();
		destroyer = sandbox.spy();
		svg = new SVGRenderer( treeCreator, creator, maintainer, destroyer );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( "constructor", () => {
		it( "should be a constructor", () => {
			expect( SVGRenderer ).to.be.a( "function" );
		} );

		it( "should set dependencies as properties", () => {
			expect( svg.treeCreator ).to.equal( treeCreator );
			expect( svg.creator ).to.equal( creator );
			expect( svg.maintainer ).to.equal( maintainer );
			expect( svg.destroyer ).to.equal( destroyer );

			expect( svg.ns ).to.equal( "http://www.w3.org/2000/svg" );
		} );
	} );

	describe( "appendTo", () => {
		it( "should append root node to element", () => {
			svg.ns = "namespace";
			let el = element( "div" );
			svg.appendTo( el );

			expect( svg.root.name ).to.equal( "namespace:svg" );
			expect( svg.root.parentNode ).to.equal( el );
			expect( svg.g.name ).to.equal( "namespace:g" );
			expect( svg.g.parentNode ).to.equal( svg.root );
		} );

		it( "should not create new root if it already exists", () => {
			let dummy = {name: "dummy"};
			let el = element( "div" );
			svg.root = dummy;
			svg.appendTo( el );

			expect( svg.root ).to.equal( dummy );
			expect( svg.root.parentNode ).to.equal( el );
		} );
	} );

	describe( "render", () => {
		it( "should call tree creator with proper params", () => {
			svg.rect.width = 50;
			svg.rect.height = 20;
			svg.root = element( "svg" );
			svg.g = element( "g" );
			let items = ["a"];
			svg.items = "b";
			svg.render( items );
			expect( treeCreator ).to.have.been.calledWith( "b", items, svg.g, creator, maintainer, destroyer );
		} );
	} );

	describe( "clear", () => {
		it( "should remove all elements", () => {
			svg.items = ["a"];
			svg.root = element( "svg" );
			svg.g = element( "node" );
			svg.root.appendChild( svg.g );

			svg.g.appendChild( element("circle") );
			svg.g.appendChild( element("rect") );
			expect( svg.g.children.length ).to.equal( 2 );

			svg.clear();

			expect( svg.g.name ).to.equal( "node" );
			expect( svg.g.children.length ).to.equal( 0 );
			expect( svg.items.length ).to.equal( 0 );
		} );
	} );

	describe( "destroy", () => {
		it( "should detach root from its parent", () => {
			let parent = element( "div" );
			svg.root = element( "svg" );
			parent.appendChild( svg.root );
			expect( svg.root.parentNode ).to.equal( parent );
			svg.destroy();

			expect( svg.root ).to.equal( null );
			expect( parent.children.length ).to.equal( 0 );
		} );

		it( "should not throw error if root does not have parent", () => {
			svg.root = element( "svg" );
			let fn = () => {
				svg.destroy();
			};
			expect( fn ).to.not.throw();
		} );
	} );
} );
