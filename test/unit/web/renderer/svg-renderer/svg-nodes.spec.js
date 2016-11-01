import { svgNs, creator, maintainer, destroyer } from "../../../../../src/web/renderer/svg-renderer/svg-nodes";

describe( "svg-nodes", () => {
	it( "should have the correct svg namespace", () => {
		expect( svgNs ).to.equal( "http://www.w3.org/2000/svg" );
	} );

	describe( "creator", () => {
		it( "should throw error when type is invalid", () => {
			expect( creator ).to.throw( Error );
		} );

		it( "should create an element and append it to the parent", () => {
			let p = {
				ownerDocument: {
					createElementNS: sinon.stub().returns( "candy" )
				},
				appendChild: sinon.spy()
			};

			creator( "magic", p );
			expect( p.ownerDocument.createElementNS ).to.have.been.calledWithExactly( svgNs, "magic" );
			expect( p.appendChild ).to.have.been.calledWithExactly( "candy" );
		} );

		it( "should return the created element", () => {
			let p = {
				ownerDocument: {
					createElementNS: sinon.stub().returns( "candy" )
				},
				appendChild: sinon.spy()
			};

			expect( creator( "magic", p ) ).to.equal( "candy" );
		} );

		it( "should create a group element for type container", () => {
			let p = {
				ownerDocument: {
					createElementNS: sinon.stub().returns( "candy" )
				},
				appendChild: sinon.spy()
			};

			creator( "container", p );
			expect( p.ownerDocument.createElementNS ).to.have.been.calledWithExactly( svgNs, "g" );
		} );
	} );

	describe( "destroyer", () => {
		it( "should remove node from parent", () => {
			let el = {
				parentNode: {
					removeChild: sinon.spy()
				}
			};
			destroyer( el );
			expect( el.parentNode.removeChild ).to.have.been.calledWithExactly( el );
		} );

		it( "should not throw error if parentNode is falsy", () => {
			let fn = () => {
					destroyer( {} );
				};
			expect( fn ).to.not.throw();
		} );
	} );

	describe( "maintainer", () => {
		it( "should apply given attributes", () => {
			let el = {
				setAttribute: sinon.spy()
			},
			item = {
				cx: 13,
				fill: "red"
			};
			maintainer( el, item );
			expect( el.setAttribute.firstCall ).to.have.been.calledWithExactly( "cx", 13 );
			expect( el.setAttribute.secondCall ).to.have.been.calledWithExactly( "fill", "red" );
		} );

		it( "should ignore attributes id, data, type, children", () => {
			let el = {
				setAttribute: sinon.spy()
			},
			item = {
				id: "a",
				data: "a",
				type: "a",
				children: "a"
			};
			maintainer( el, item );
			expect( el.setAttribute.callCount ).to.equal( 0 );
		} );
	} );
} );
