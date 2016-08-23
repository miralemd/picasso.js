import { AxisStructs } from "./axis-structs";

describe.only( "AxisStructs", () => {
	const rect = { x: 0, y: 0, width: 0, height: 0 };
	const rendererRect = { x: 0, y: 0, width: 0, height: 0 };

	beforeEach( () => {
		rect.width = 50;
		rect.height = 100;
		rect.x = 0;
		rect.y = 0;
		rendererRect.width = 50;
		rendererRect.height = 100;
		rendererRect.x = 0;
		rendererRect.y = 0;
	} );

	describe( "Tick", () => {
		let settings, tick, expected;

		beforeEach( () => {
			settings = {
				style: { thickness: 1, color: "red", size: 5 },
				dock: "bottom",
				spacing: 10
			};
			tick = { position: 0.5 };
			expected = { type: "line", "stroke-width": 1, stroke: "red", x1: 0, x2: 0, y1: 0, y2: 0 };
		} );

		describe( "Left dock", () => {
			beforeEach( () => {
				settings.dock = "left";
				expected.x1 = -settings.spacing;
				expected.x2 = -settings.spacing - settings.style.size;
			} );

			it( "middle tick", () => {
				expected.y1 = 50;
				expected.y2 = 50;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );

			it( "start tick", () => {
				tick.position = 0;
				expected.y1 = 99.5;
				expected.y2 = 99.5;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );

			it( "end tick", () => {
				tick.position = 1;
				expected.y1 = 0.5;
				expected.y2 = 0.5;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Right dock", () => {
			beforeEach( () => {
				settings.dock = "right";
				expected.x1 = settings.spacing;
				expected.x2 = settings.spacing + settings.style.size;
			} );

			it( "middle tick", () => {
				expected.y1 = 50;
				expected.y2 = 50;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );

			it( "start tick", () => {
				tick.position = 0;
				expected.y1 = 99.5;
				expected.y2 = 99.5;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );

			it( "end tick", () => {
				tick.position = 1;
				expected.y1 = 0.5;
				expected.y2 = 0.5;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Top dock", () => {
			beforeEach( () => {
				settings.dock = "top";
				expected.y1 = -settings.spacing;
				expected.y2 = -settings.spacing - settings.style.size;
			} );

			it( "middle tick", () => {
				expected.x1 = 25;
				expected.x2 = 25;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );

			it( "start tick", () => {
				tick.position = 0;
				expected.x1 = 0.5;
				expected.x2 = 0.5;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );

			it( "end tick", () => {
				tick.position = 1;
				expected.x1 = 49.5;
				expected.x2 = 49.5;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Bottom dock", () => {
			beforeEach( () => {
				settings.dock = "bottom";
				expected.y1 = settings.spacing;
				expected.y2 = settings.spacing + settings.style.size;
			} );

			it( "middle tick", () => {
				expected.x1 = 25;
				expected.x2 = 25;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );

			it( "start tick", () => {
				tick.position = 0;
				expected.x1 = 0.5;
				expected.x2 = 0.5;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );

			it( "end tick", () => {
				tick.position = 1;
				expected.x1 = 49.5;
				expected.x2 = 49.5;
				expect( AxisStructs.tick( tick, settings, rect ) ).to.deep.equal( expected );
			} );
		} );
	} );

	describe( "Label", () => {
		let settings, tick, expected;
		AxisStructs.setRenderer( { measureText: () => { return { width: 10 }; }, ellipsis: ( opt ) => { return opt.text; } } );

		beforeEach( () => {
			settings = {
				style: { font: "Arial", color: "red", size: 10 },
				dock: "bottom",
				spacing: 10,
				direction: "ltl",
				tilted: false
			};
			tick = { position: 0.5, label: "50%" };
			expected = {
				type: "text",
				text: "50%",
				x: 0,
				y: 0,
				fill: "red",
				"font-family": "Arial",
				"font-size": 10,
				direction: "ltl",
				"text-anchor": "end"
			};
		} );

		describe( "Left dock", () => {
			beforeEach( () => {
				settings.dock = "left";
				expected.x = -10;
			} );

			it( "middle label", () => {
				expected.y = 53.333333333333336;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "start label", () => {
				tick.position = 0;
				expected.y = 100;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "start label with margin", () => {
				rendererRect.height = 105;
				tick.position = 0;
				expected.y = 103.33333333333333;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "end label", () => {
				tick.position = 1;
				expected.y = 10;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "end label with margin", () => {
				rect.y = 5;
				tick.position = 1;
				expected.y = 5;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "tilted", () => {
				settings.tilted = true;
				expected.y = 53.333333333333336;
				expected.transform = "rotate(-45, -10, 53.333333333333336)";
				expected["text-anchor"] = "end";
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Right dock", () => {
			beforeEach( () => {
				settings.dock = "right";
				expected.x = 10;
				expected["text-anchor"] = "start";
			} );

			it( "middle label", () => {
				expected.y = 53.333333333333336;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "start label", () => {
				tick.position = 0;
				expected.y = 100;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "start label with margin", () => {
				rendererRect.height = 105;
				tick.position = 0;
				expected.y = 103.33333333333333;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "end label", () => {
				tick.position = 1;
				expected.y = 10;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "end label with margin", () => {
				rect.y = 5;
				tick.position = 1;
				expected.y = 5;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "tilted", () => {
				settings.tilted = true;
				expected.y = 53.333333333333336;
				expected.transform = "rotate(-45, 10, 53.333333333333336)";
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Top dock", () => {
			beforeEach( () => {
				settings.dock = "top";
				expected.y = -10;
				expected["text-anchor"] = "middle";
			} );

			it( "middle label", () => {
				expected.x = 25;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "start label", () => {
				tick.position = 0;
				expected.x = 5;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "start label with margin", () => {
				tick.position = 0;
				rect.x = 5;
				expected.x = 0;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "end label", () => {
				tick.position = 1;
				expected.x = 45;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "end label with margin", () => {
				tick.position = 1;
				rendererRect.width = 65;
				expected.x = 50;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "tilted", () => {
				settings.tilted = true;
				expected.x = 25;
				expected.transform = "rotate(-45, 25, -10)";
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Bottom dock", () => {
			beforeEach( () => {
				settings.dock = "bottom";
				expected.y = 20;
				expected["text-anchor"] = "middle";
			} );

			it( "middle label", () => {
				expected.x = 25;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "start label", () => {
				tick.position = 0;
				expected.x = 5;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "start label with margin", () => {
				tick.position = 0;
				rect.x = 5;
				expected.x = 0;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "end label", () => {
				tick.position = 1;
				expected.x = 45;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "end label with margin", () => {
				tick.position = 1;
				rendererRect.width = 65;
				expected.x = 50;
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );

			it( "tilted", () => {
				settings.tilted = true;
				expected.x = 25;
				expected.transform = "rotate(-45, 25, 20)";
				expect( AxisStructs.label( tick, settings, rect, rendererRect ) ).to.deep.equal( expected );
			} );
		} );
	} );

	describe( "Title", () => {
		let settings, expected;
		AxisStructs.setRenderer( { measureText: () => { return { width: 10 }; }, ellipsis: ( opt ) => { return opt.text; } } );

		beforeEach( () => {
			settings = {
				style: { font: "Arial", color: "red", size: 10 },
				dock: "bottom",
				spacing: 10,
				direction: "ltl",
				tilted: false,
				value: "My Title"
			};
			expected = {
				type: "text",
				text: "My Title",
				x: 0,
				y: 0,
				fill: "red",
				"font-family": "Arial",
				"font-size": 10,
				direction: "ltl",
				"text-anchor": "middle"
			};
		} );

		it( "Left dock", () => {
			settings.dock = "left";
			expected.x = -10;
			expected.y = 50;
			expected.transform = "rotate(270 -10 50)";
			expect( AxisStructs.title( settings, rect ) ).to.deep.equal( expected );
		} );

		it( "Right dock", () => {
			settings.dock = "right";
			expected.x = 10;
			expected.y = 50;
			expected.transform = "rotate(90 10 50)";
			expect( AxisStructs.title( settings, rect ) ).to.deep.equal( expected );
		} );

		it( "Top dock", () => {
			settings.dock = "top";
			expected.x = 25;
			expected.y = -10;
			expect( AxisStructs.title( settings, rect ) ).to.deep.equal( expected );
		} );

		it( "Bottom dock", () => {
			settings.dock = "bottom";
			expected.x = 25;
			expected.y = 10;
			expect( AxisStructs.title( settings, rect ) ).to.deep.equal( expected );
		} );
	} );

	describe( "Line", () => {
		let settings, expected;

		beforeEach( () => {
			settings = {
				style: { color: "red", size: 1 },
				dock: "bottom"
			};
			expected = { type: "line", "stroke-width": 1, stroke: "red", x1: 0, x2: 0, y1: 0, y2: 0 };
		} );

		it( "Left dock", () => {
			settings.dock = "left";
			expected.x1 = -0.5;
			expected.x2 = -0.5;
			expected.y2 = 100;
			expect( AxisStructs.line( settings, rect ) ).to.deep.equal( expected );
		} );

		it( "Right dock", () => {
			settings.dock = "right";
			expected.x1 = 0.5;
			expected.x2 = 0.5;
			expected.y2 = 100;
			expect( AxisStructs.line( settings, rect ) ).to.deep.equal( expected );
		} );

		it( "Top dock", () => {
			settings.dock = "top";
			expected.x2 = 50;
			expected.y1 = -0.5;
			expected.y2 = -0.5;
			expect( AxisStructs.line( settings, rect ) ).to.deep.equal( expected );
		} );

		it( "Bottom dock", () => {
			settings.dock = "bottom";
			expected.x2 = 50;
			expected.y1 = 0.5;
			expected.y2 = 0.5;
			expect( AxisStructs.line( settings, rect ) ).to.deep.equal( expected );
		} );
	} );
} );
