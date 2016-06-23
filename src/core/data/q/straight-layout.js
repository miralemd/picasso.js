function normalizeMeta( obj ) {
	if ( "qStateCounts" in obj ) { // dimension
		return {
			min: obj.qMin,
			max: obj.qMax,
			count: obj.qStateCounts.qOption + obj.qStateCounts.qLocked + obj.qStateCounts.qSelected
		};
	} else {
		return {
			min: obj.qMin,
			max: obj.qMax
		};
	}
}

function resolvePath( path, obj ) {
	let arr = path.replace( /^\//, "" ).split( /\// ),
		container = obj;
	for ( let i = 0; i < arr.length; i++ ) {
		if ( !arr[i] && Array.isArray( container ) ) {
			return container.map( v => {
				return resolvePath( arr.slice( i + 1 ).join( "/" ), v );
			} );
		} else if ( arr[i] in container ) {
			container = container[arr[i]];
		}
	}

	return container;
}

function sourceToDataPath( path, meta ) {
	let p = path,
		numDimz = meta.qHyperCube.qDimensionInfo.length;
	p = p.replace( /(qMeasureInfo\/)(\d+)/g, function( match, m, idx ){
		return ["qDataPages", "${page}", "qMatrix", "", numDimz + +idx].join( "/" );
	} );
	p = p.replace( /qDimensionInfo/g, "qDataPages/${page}/qMatrix/" );
	p = p.replace( /qAttrExprInfo/g, "qAttrExps/qValues" );
	return p;
}

export default class StraightLayout {
	constructor( Promise ) {
		this.Promise = Promise;
	}

	metaOf( path ) {
		return normalizeMeta( resolvePath( path, this._layout ) );
	}

	layout( value ) {
		if ( typeof value === "undefined" ) {
			return this._layout;
		}
		this._layout = value;
		return this;
	}

	dataPages( ) {
		if ( !this._layout ) {
			return this.Promise.reject();
		}
		return this.Promise.resolve( this._layout.qHyperCube.qDataPages );
	}

	fromSource( source, pageIdx ) {
		let fn = s => {
			let path = sourceToDataPath( s, this._layout );
			return resolvePath( path.replace( "${page}", pageIdx ), this._layout );
		};
		return Array.isArray( source ) ? source.map( fn ) : fn( source );
	}
}

export function create() {
	return new StraightLayout( Promise );
}
