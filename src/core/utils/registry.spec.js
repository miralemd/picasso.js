import { default as Registry, registry } from "./registry";

describe( "Registry", () => {
	let reg;
	beforeEach( () => {
		reg = new Registry();
	} );

	describe( "registry", () => {
		it( "should instantiate a new registry", () => {
			expect( registry() ).to.be.an.instanceof( Registry );
		} );
	} );

	describe( "register", () => {
		it( "should register a function", () => {
			let fn = () => {};
			reg.register( "foo", fn );
			expect( reg.registry.foo ).to.equal( fn );
		} );
		it( "should throw error if name is invalid", () => {
			let fn = () => {
				reg.register( "" );
			}, fn2 = () => {
				reg.register( 5 );
			};

			expect( fn ).to.throw( "Invalid name" );
			expect( fn2 ).to.throw( "Invalid name" );
		} );
		it( "should throw error if fn is not a function", () => {
			let fn = () => {
				reg.register( "a" );
			};

			expect( fn ).to.throw( "fn must be a function" );
		} );
		it( "should throw error if name is taken", () => {
			let fn = () => {
				reg.register( "a", () => {} );
			};
			reg.register( "a", () => {} );
			expect( fn ).to.throw( "a already exists" );
		} );
	} );

	describe( "build", () => {
		let sandbox,
			fn;
		beforeEach( () => {
			sandbox = sinon.sandbox.create();
			fn = sandbox.stub().returns( "something" );
			reg.register( "foo", fn );
		} );
		it( "should build", () => {
			let obj = {
					type: "yes"
				},
				b = reg.build( {
					useless: {},
					foo: obj
				} );

			expect( fn ).to.have.been.calledWith( obj );
			expect( b.foo ).to.equal( "something" );
		} );
	} );
} );
