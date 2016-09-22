import { format as d3Format } from "d3-format";

export default class Format {
	constructor( ) {
		this._format = d3Format();
	}

	format( value ) {
		return this._format( value );
	}
}

export function format( ...a ) {
	return new Format( ...a );
}
