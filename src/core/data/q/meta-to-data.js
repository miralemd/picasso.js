import { resolve } from "../json-path-resolver";

const metaToData = [
	{
		pattern: /qDimensionInfo/,
		data: "qDataPages//qMatrix/"
	},
	{
		pattern: /(qMeasureInfo\/)(\d+)/,
		pre: function( path, meta ) {
			let pathToDimz = path.substr( 0, path.indexOf( "qMeasureInfo" ) ) + "qDimensionInfo";
			let numDimz = resolve( pathToDimz, meta ).length;
			return path.replace( /(qMeasureInfo\/)(\d+)/, function( match, m, idx ) {
				return m + ( numDimz + +idx );
			} );
		},
		data: function( match, m, idx ) {
			return ["qDataPages", "", "qMatrix", "", +idx ].join( "/" );
		}
		//data: "qDataPages//qMatrix//"
	},
	{
		pattern: /qAttrExprInfo/,
		data: "qAttrExps/qValues"
	}
];

export function metaToDataPath( path, meta ) {
	let p = path;
	for ( let i = 0; i < metaToData.length; i++ ) {
		if ( !metaToData[i].pattern.test( path ) ) {
			continue;
		}
		if ( metaToData[i].pre ) {
			p = metaToData[i].pre( p, meta || {} );
		}
		p = p.replace( metaToData[i].pattern, metaToData[i].data );
	}

	return p;
}
