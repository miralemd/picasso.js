import { metaToDataPath } from "../../../../../src/core/data/q/meta-to-data";

describe( "Meta to Data path", () => {
	it( "should map dimension info to data pages path", () => {
		let p = "foo/hyper/qDimensionInfo/3";
		expect( metaToDataPath( p ) ).to.equal( "foo/hyper/qDataPages//qMatrix//3" );
	} );

	it( "should map measure info to data pages path", () => {
		let p = "foo/hyper/qMeasureInfo/1";
		let meta = {
			foo: {
				hyper: {
					qDimensionInfo: [0, 1, 2]
				}
			}
		};
		// note that measure info index = 1 is mapped to numDimensions + index = 4
		expect( metaToDataPath( p, meta ) ).to.equal( "foo/hyper/qDataPages//qMatrix//4" );
	} );

	it( "should map attr expr", () => {
		let p = "foo/hyper/qAttrExprInfo/1";
		let meta = {
			foo: {
				hyper: {
					qDimensionInfo: [0, 1, 2]
				}
			}
		};
		expect( metaToDataPath( p, meta ) ).to.equal( "foo/hyper/qAttrExps/qValues/1" );
	} );

	it( "should map measure and attr expr", () => {
		let p = "foo/hyper/qMeasureInfo/1/qAttrExprInfo/1";
		let meta = {
			foo: {
				hyper: {
					qDimensionInfo: [0, 1, 2]
				}
			}
		};
		expect( metaToDataPath( p, meta ) ).to.equal( "foo/hyper/qDataPages//qMatrix//4/qAttrExps/qValues/1" );
	} );
} );
