import { buildTick, buildLabel, buildLine } from "../../../../../src/core/chart-components/axis/axis-structs";

describe.skip( "AxisStructs", () => {
	const innerRect = { x: 0, y: 0, width: 0, height: 0 };
	const outerRect = { x: 0, y: 0, width: 0, height: 0 };
	const textRect = { width: 10, height: 10 };

	beforeEach( () => {
		innerRect.width = 50;
		innerRect.height = 100;
		innerRect.x = 0;
		innerRect.y = 0;
		outerRect.width = 50;
		outerRect.height = 100;
		outerRect.x = 0;
		outerRect.y = 0;
	} );

	describe( "Tick", () => {
		let buildOpts, tick, expected;

		beforeEach( () => {
			buildOpts = {
				style: { strokeWidth: 1, stroke: "red" },
				tickSize: 5,
				align: "bottom",
				padding: 10,
				innerRect: innerRect,
				outerRect: outerRect
			};
			tick = { position: 0.5 };
			expected = {
				type: "line",
				strokeWidth: 1,
				stroke: "red",
				x1: 0,
				x2: 0,
				y1: 0,
				y2: 0 };
		} );

		describe( "Left align", () => {
			beforeEach( () => {
				buildOpts.align = "left";
				expected.x1 = -buildOpts.padding;
				expected.x2 = -buildOpts.padding - buildOpts.tickSize;
			} );

			it( "middle tick", () => {
				expected.y1 = 50;
				expected.y2 = 50;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start tick", () => {
				tick.position = 0;
				expected.y1 = 99.5;
				expected.y2 = 99.5;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end tick", () => {
				tick.position = 1;
				expected.y1 = 0.5;
				expected.y2 = 0.5;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Right align", () => {
			beforeEach( () => {
				buildOpts.align = "right";
				expected.x1 = buildOpts.padding;
				expected.x2 = buildOpts.padding + buildOpts.tickSize;
			} );

			it( "middle tick", () => {
				expected.y1 = 50;
				expected.y2 = 50;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start tick", () => {
				tick.position = 0;
				expected.y1 = 99.5;
				expected.y2 = 99.5;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end tick", () => {
				tick.position = 1;
				expected.y1 = 0.5;
				expected.y2 = 0.5;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Top align", () => {
			beforeEach( () => {
				buildOpts.align = "top";
				expected.y1 = -buildOpts.padding;
				expected.y2 = -buildOpts.padding - buildOpts.tickSize;
			} );

			it( "middle tick", () => {
				expected.x1 = 25;
				expected.x2 = 25;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start tick", () => {
				tick.position = 0;
				expected.x1 = 0.5;
				expected.x2 = 0.5;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end tick", () => {
				tick.position = 1;
				expected.x1 = 49.5;
				expected.x2 = 49.5;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Bottom align", () => {
			beforeEach( () => {
				buildOpts.align = "bottom";
				expected.y1 = buildOpts.padding;
				expected.y2 = buildOpts.padding + buildOpts.tickSize;
			} );

			it( "middle tick", () => {
				expected.x1 = 25;
				expected.x2 = 25;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start tick", () => {
				tick.position = 0;
				expected.x1 = 0.5;
				expected.x2 = 0.5;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end tick", () => {
				tick.position = 1;
				expected.x1 = 49.5;
				expected.x2 = 49.5;
				expect( buildTick( tick, buildOpts ) ).to.deep.equal( expected );
			} );
		} );
	} );

	describe( "Label", () => {
		let buildOpts, tick, expected;

		beforeEach( () => {
			buildOpts = {
				style: { fontFamily: "Arial", fill: "red", fontSize: 10 },
				align: "bottom",
				padding: 10,
				innerRect: innerRect,
				outerRect: outerRect,
				maxWidth: textRect.width,
				maxHeight: textRect.height,
				textRect: textRect
			};
			tick = { position: 0.5, label: "50%" };
			expected = {
				type: "text",
				text: "50%",
				x: 0,
				y: 0,
				fill: "red",
				fontFamily: "Arial",
				fontSize: 10,
				anchor: "end",
				maxWidth: textRect.width,
				maxHeight: textRect.height
			};
		} );

		describe( "Left align", () => {
			beforeEach( () => {
				buildOpts.align = "left";
				expected.x = -10;
				expected.baseline = "central";
			} );

			it( "middle label", () => {
				expected.y = 50;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start label", () => {
				tick.position = 0;
				expected.y = 100;
				expected.baseline = "text-after-edge";
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start label with margin", () => {
				outerRect.height = 105;
				tick.position = 0;
				expected.y = 100;
				expected.baseline = "central";
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end label", () => {
				tick.position = 1;
				expected.y = 0;
				expected.baseline = "text-before-edge";
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end label with margin", () => {
				innerRect.y = 5;
				tick.position = 1;
				expected.y = 5;
				expected.baseline = "central";
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Right align", () => {
			beforeEach( () => {
				buildOpts.align = "right";
				expected.x = 10;
				expected.anchor = "start";
				expected.baseline = "central";
			} );

			it( "middle label", () => {
				expected.y = 50;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start label", () => {
				tick.position = 0;
				expected.y = 100;
				expected.baseline = "text-after-edge";
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start label with margin", () => {
				outerRect.height = 105;
				tick.position = 0;
				expected.y = 100;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end label", () => {
				tick.position = 1;
				expected.y = 0;
				expected.baseline = "text-before-edge";
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end label with margin", () => {
				innerRect.y = 5;
				tick.position = 1;
				expected.y = 5;
				expected.baseline = "central";
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Top align", () => {
			beforeEach( () => {
				buildOpts.align = "top";
				expected.y = -10;
				expected.anchor = "middle";
			} );

			it( "middle label", () => {
				expected.x = 25;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start label", () => {
				tick.position = 0;
				expected.x = 0;
				expected.anchor = "left";
				expected.maxWidth = expected.maxWidth * 0.75;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start label with margin", () => {
				tick.position = 0;
				innerRect.x = 5;
				expected.x = 5;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end label", () => {
				tick.position = 1;
				expected.x = 50;
				expected.anchor = "end";
				expected.maxWidth = expected.maxWidth * 0.75;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end label with margin", () => {
				tick.position = 1;
				outerRect.width = 65;
				expected.x = 50;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );
		} );

		describe( "Bottom align", () => {
			beforeEach( () => {
				buildOpts.align = "bottom";
				expected.y = 20;
				expected.anchor = "middle";
			} );

			it( "middle label", () => {
				expected.x = 25;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start label", () => {
				tick.position = 0;
				expected.x = 0;
				expected.anchor = "left";
				expected.maxWidth = expected.maxWidth * 0.75;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "start label with margin", () => {
				tick.position = 0;
				innerRect.x = 5;
				expected.x = 5;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end label", () => {
				tick.position = 1;
				expected.x = 50;
				expected.anchor = "end";
				expected.maxWidth = expected.maxWidth * 0.75;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );

			it( "end label with margin", () => {
				tick.position = 1;
				outerRect.width = 65;
				expected.x = 50;
				expect( buildLabel( tick, buildOpts ) ).to.deep.equal( expected );
			} );
		} );
	} );

	describe( "Line", () => {
		let buildOpts, expected;

		beforeEach( () => {
			buildOpts = {
				style: { stroke: "red", strokeWidth: 1 },
				align: "bottom",
				innerRect: innerRect,
				outerRect: outerRect
			};
			expected = { type: "line", strokeWidth: 1, stroke: "red", x1: 0, x2: 0, y1: 0, y2: 0 };
		} );

		it( "Left align", () => {
			buildOpts.align = "left";
			expected.x1 = -0.5;
			expected.x2 = -0.5;
			expected.y2 = 100;
			expect( buildLine( buildOpts ) ).to.deep.equal( expected );
		} );

		it( "Right align", () => {
			buildOpts.align = "right";
			expected.x1 = 0.5;
			expected.x2 = 0.5;
			expected.y2 = 100;
			expect( buildLine( buildOpts ) ).to.deep.equal( expected );
		} );

		it( "Top align", () => {
			buildOpts.align = "top";
			expected.x2 = 50;
			expected.y1 = -0.5;
			expected.y2 = -0.5;
			expect( buildLine( buildOpts ) ).to.deep.equal( expected );
		} );

		it( "Bottom align", () => {
			buildOpts.align = "bottom";
			expected.x2 = 50;
			expected.y1 = 0.5;
			expected.y2 = 0.5;
			expect( buildLine( buildOpts ) ).to.deep.equal( expected );
		} );
	} );
} );
