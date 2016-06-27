import { resolve } from "../json-path-resolver";
import { metaToDataPath } from "./meta-to-data";

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

export default class StraightLayout {
	constructor( Promise ) {
		this.Promise = Promise;
	}

	metaOf( path ) {
		return normalizeMeta( resolve( path, this._layout ) );
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
			let path = metaToDataPath( s, this._layout );
			return resolve( path.replace( "qDataPages/", "qDataPages/" + pageIdx ), this._layout );
		};
		return Array.isArray( source ) ? source.map( fn ) : fn( source );
	}
}

export function create() {
	return new StraightLayout( Promise );
}
