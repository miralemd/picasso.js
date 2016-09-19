import { qTable } from "./q-table";

describe( "qTable", () => {
	let q,
		fieldFn = () => {
			let field = () => {};
			field.data = d => d.name;
			return field;
		};
	beforeEach( () => {
		q = qTable( fieldFn );
		q.data( {
			qSize: { qcx: 3, qcy: 20 },
			qDimensionInfo: [{ name: "A" }, { name: "B" }],
			qMeasureInfo: [{ name: "C" }]
		} );
	} );

	it( "should return number of rows", () => {
		expect( q.rows() ).to.equal( 20 );
	} );

	it( "should return number of cols", () => {
		expect( q.cols() ).to.equal( 3 );
	} );

	it( "should have 3 fields", () => {
		expect( q.fields() ).to.deep.equal( ["A", "B", "C"] );
	} );
} );
