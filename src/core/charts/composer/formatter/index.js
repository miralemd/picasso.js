import { formatter } from "../../../formatter";

function fieldFinder( query, field ) {
	return field.title() === query;
}

export function create( options, table ) {
	// TODO Have some magic to handle and merge formatters from multiple sources

	if ( options.source ) {
		let	field = table.findField( options.source, fieldFinder );

		if ( typeof field !== "undefined" ) {
			return field.formatter();
		}
	}

	return formatter( options.formatter || "d3" )( options.type || "number" )( options.format || "" );
			//.locale( options.locale || {} );
}

export default function builder( obj, composer ) {
	let formatters = {};
	for ( let f in obj ) {
		formatters[f] = create( obj[f], composer.table() );
	}
	return formatters;
}


export function getOrCreateFormatter( v, formatters, tables ) {
	let f;
	if ( typeof v === "string" && formatters[v] ) { // return by name
		f = formatters[v];
	} else if ( typeof v === "object" && "formatter" in v && formatters[v.formatter] ) { // return by { formatter: "name" }
		f = formatters[v.formatter];
	}

	return f || create( v, tables );
}
