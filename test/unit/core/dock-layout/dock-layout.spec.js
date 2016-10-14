import { dockLayout } from "../../../../src/core/dock-layout/dock-layout";
import { dockConfig } from "../../../../src/core/dock-layout/dock-config";

describe( "Dock Layout", () => {
	let componentMock = function( dock, size, order = 0 ) {
		let outerRect = { x: 0, y: 0, width: 0, height: 0 };
		let innerRect = { x: 0, y: 0, width: 0, height: 0 };
		let containerRect = { x: 0, y: 0, width: 0, height: 0 };

		let dummy = function() {};

		dummy.dockConfig = dockConfig( dock, order );
		dummy.dockConfig.requiredSize( ( rect ) => rect.width * size );
		dummy.resize = function( ...args ) {
			if ( !args.length ) {
				return { innerRect, outerRect, containerRect };
			}
			[innerRect, outerRect, containerRect] = args;
			return this;
		};

		return dummy;
	};

	it( "should always return an inner, outer and a container rect", () => {
		let leftComp = componentMock( "left", 0.05 );
		let rightComp = componentMock( "right", 0.1 );
		let mainComp = componentMock( "", 0 );
		let topComp = componentMock( "top", 0.15 );
		let bottomComp = componentMock( "bottom", 0.2 );
		let rect = { x: 0, y: 0, width: 1000, height: 1000 };
		let dl = dockLayout();
		dl.addComponent( leftComp );
		dl.addComponent( rightComp );
		dl.addComponent( mainComp );
		dl.addComponent( topComp );
		dl.addComponent( bottomComp );

		dl.layout( rect );

		expect( leftComp.resize().outerRect, "Left outerRect had incorrect calculated size" ).to.deep.equal( { x: 0, y: 0, width: 50, height: 1000 } );
		expect( rightComp.resize().outerRect, "Right outerRect had incorrect calculated size" ).to.deep.equal( { x: 900, y: 0, width: 100, height: 1000 } );
		expect( mainComp.resize().outerRect, "Main outerRect had incorrect calculated size" ).to.deep.equal( { x: 50, y: 150, width: 850, height: 650 } );
		expect( topComp.resize().outerRect, "Top outerRect had incorrect calculated size" ).to.deep.equal( { x: 0, y: 0, width: 1000, height: 150 } );
		expect( bottomComp.resize().outerRect, "Bottom outerRect had incorrect calculated size" ).to.deep.equal( { x: 0, y: 800, width: 1000, height: 200 } );

		expect( leftComp.resize().innerRect, "Left innerRect had incorrect calculated size" ).to.deep.equal( { x: 0, y: 150, width: 50, height: 650 } );
		expect( rightComp.resize().innerRect, "Right innerRect had incorrect calculated size" ).to.deep.equal( { x: 900, y: 150, width: 100, height: 650 } );
		expect( mainComp.resize().innerRect, "Main innerRect had incorrect calculated size" ).to.deep.equal( { x: 50, y: 150, width: 850, height: 650 } );
		expect( topComp.resize().innerRect, "Top innerRect had incorrect calculated size" ).to.deep.equal( { x: 50, y: 0, width: 850, height: 150 } );
		expect( bottomComp.resize().innerRect, "Bottom innerRect had incorrect calculated size" ).to.deep.equal( { x: 50, y: 800, width: 850, height: 200 } );

		expect( bottomComp.resize().containerRect, "Incorrect size for container rect" ).to.deep.equal( rect );
	} );

	it( "should allow multiple components to dock on same side", () => {
		let leftComp = componentMock( "left", 0.05 );
		let leftComp2 = componentMock( "left", 0.1 );
		let leftComp3 = componentMock( "left", 0.15 );
		let mainComp = componentMock( "", 0 );
		let rect = { x: 0, y: 0, width: 1000, height: 1000 };
		let dl = dockLayout();
		dl.addComponent( leftComp );
		dl.addComponent( leftComp2 );
		dl.addComponent( leftComp3 );
		dl.addComponent( mainComp );

		dl.layout( rect );

		expect( leftComp.resize().innerRect, "leftComp innerRect had incorrect calculated size" ).to.deep.equal( { x: 250, y: 0, width: 50, height: 1000 } );
		expect( leftComp2.resize().innerRect, "leftComp2 innerRect had incorrect calculated size" ).to.deep.equal( { x: 150, y: 0, width: 100, height: 1000 } );
		expect( leftComp3.resize().innerRect, "leftComp3 innerRect had incorrect calculated size" ).to.deep.equal( { x: 0, y: 0, width: 150, height: 1000 } );
		expect( mainComp.resize().innerRect, "Main innerRect had incorrect calculated size" ).to.deep.equal( { x: 300, y: 0, width: 700, height: 1000 } );
	} );

	it( "should apply a default configuration if a component have not set one", () => {
		let rect = { x: 0, y: 0, width: 1000, height: 1000 };
		let mainComp = componentMock();
		mainComp.dockConfig = undefined;
		let dl = dockLayout();
		dl.addComponent( mainComp );
		dl.layout( rect );
		expect( mainComp.resize().innerRect, "Main innerRect had incorrect calculated size" ).to.deep.equal( { x: 0, y: 0, width: 1000, height: 1000 } );
	} );

	it( "should thrown an expection if component doesnt implement needed properties", () => {
		let leftComp = { dock: "left" };
		let mainComp = {};
		let dl = dockLayout();
		let fn = () => { dl.addComponent( leftComp ); };
		let fn2 = () => { dl.addComponent( mainComp ); };
		expect( fn ).to.throw( "Component is missing required function \"resize\"" );
		expect( fn2 ).to.throw( "Component is missing required function \"resize\"" );
	} );
} );
