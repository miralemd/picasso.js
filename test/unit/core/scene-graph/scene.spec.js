import { scene } from "../../../../src/core/scene-graph/scene";
import { create as createStage } from "../../../../src/core/scene-graph/display-objects/stage";

describe( "Scene", () => {
	let stage,
		rect,
		container;

	beforeEach( () => {
		rect = {
			type: "rect"
		};
		container = {
			type: "container"
		};
	} );

	it( "should accept a custom stage", () => {
		let myStage = createStage();
		myStage.test = true;
		stage = scene( [], myStage );
		expect( stage.test ).to.equal( true );
	} );

	describe( "Transform", () => {
		it( "should handle transform on a flat structure", () => {
			let r1 = rect;
			let r2 = Object.assign( {}, rect );
			let r3 = Object.assign( {}, rect );
			r1.transform = "translate(50, 50)";
			r2.transform = "translate(20, 20)";
			stage = scene( [r1, r2, r3] );
			let r1do = stage.children[0];
			let r2do = stage.children[1];
			let r3do = stage.children[2];
			expect( r1do.modelViewMatrix.elements ).to.deep.equal( [
				[1, 0, 50],
				[0, 1, 50],
				[0, 0, 1]
			] );
			expect( r2do.modelViewMatrix.elements ).to.deep.equal( [
				[1, 0, 20],
				[0, 1, 20],
				[0, 0, 1]
			] );
			expect( r3do.modelViewMatrix ).to.equal( undefined );
		} );

		it( "should handle transform on a hierarchical structure", () => {
			let r1 = rect;
			let c1 = Object.assign( {}, container );
			let c2 = Object.assign( {}, container );
			c1.transform = "translate(50, 50)";
			c2.transform = "translate(20, 20)";
			container.children = [c1];
			c1.children = [c2];
			c2.children = [r1];
			stage = scene( [container] );
			let c1do = stage.children[0].children[0];
			let c2do = c1do.children[0];
			let r1do = c2do.children[0];
			expect( c1do.modelViewMatrix.elements ).to.deep.equal( [
				[1, 0, 50],
				[0, 1, 50],
				[0, 0, 1]
			] );
			expect( c2do.modelViewMatrix.elements ).to.deep.equal( [
				[1, 0, 70],
				[0, 1, 70],
				[0, 0, 1]
			] );
			expect( r1do.modelViewMatrix.elements ).to.deep.equal( [
				[1, 0, 70],
				[0, 1, 70],
				[0, 0, 1]
			] );
		} );

		it( "should handle transform on a complex hierarchical structure", () => {
			container.transform = "translate(100, 100)";
			let r1 = rect;
			let r2 = Object.assign( {}, rect );
			let r3 = Object.assign( {}, rect );
			let r0 = Object.assign( {}, rect );
			r0.transform = "translate(3, 3)";
			r2.transform = "translate(50, 50)";
			container.children = [r1, r2];
			stage = scene( [r0, container, r3] );
			let r0do = stage.children[0];
			let c1do = stage.children[1];
			let r1do = c1do.children[0];
			let r2do = c1do.children[1];
			let r3do = stage.children[2];
			expect( r0do.modelViewMatrix.elements ).to.deep.equal( [
				[1, 0, 3],
				[0, 1, 3],
				[0, 0, 1]
			], "r0do" );
			expect( c1do.modelViewMatrix.elements ).to.deep.equal( [
				[1, 0, 100],
				[0, 1, 100],
				[0, 0, 1]
			], "c1do" );
			expect( r1do.modelViewMatrix.elements ).to.deep.equal( [
				[1, 0, 100],
				[0, 1, 100],
				[0, 0, 1]
			], "r1do" );
			expect( r2do.modelViewMatrix.elements ).to.deep.equal( [
				[1, 0, 150],
				[0, 1, 150],
				[0, 0, 1]
			], "r2do" );
			expect( r3do.modelViewMatrix ).to.equal( undefined, "r3do" );
		} );
	} );
} );
