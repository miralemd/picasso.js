import { dockConfig } from "../../dock-layout/dock-config";
import { default as extend } from "extend";

function calcRequiredSize( title, settings, renderer ) {
	let fn = function() {
		let args = { text: title, fontSize: settings.style.fontSize, fontFamily: settings.style.fontFamily };
		return renderer.measureText( args ).height + settings.padding;
	};

	return fn;
}

function parseTitle( config, table, scale ) {
	let title;
	if ( typeof config.text === "function" ) {
		title = config.text( table );
	} else if ( typeof config.text === "string" ) {
		title = config.text;
	} else if ( scale && scale.sources ) {
		if ( Array.isArray( scale.sources ) ) {
			title = scale.sources.map( ( s ) => {
				return table.findField( s ).title(); } )
					.join( config.settings.join || ", " );
		} else {
			title = table.findField( scale.sources ).title();
		}
	} else {
		title = "";
	}

	return title;
}

function getTextAnchor( settings ) {
	let anchor = "middle";
	if ( settings.dock === "left" ) {
		if ( settings.anchor === "top" ) {
			anchor = "end";
		} else if ( settings.anchor === "bottom" ) {
			anchor = "start";
		}
	} else if ( settings.dock === "right" ) {
		if ( settings.anchor === "top" ) {
			anchor = "start";
		} else if ( settings.anchor === "bottom" ) {
			anchor = "end";
		}
	} else {
		if ( settings.anchor === "left" ) {
			anchor = "start";
		} else if ( settings.anchor === "right" ) {
			anchor = "end";
		}
	}
	return anchor;
}

function generateTitle( { title, settings, dock, rect, renderer } ) {
	const struct = {
		type: "text",
		text: title,
		x: 0,
		y: 0,
		anchor: getTextAnchor( settings ),
		baseline: "ideographic" // TODO Fix for IE & Edge
	};

	extend( struct, settings.style );
	let textRect = renderer.measureText( struct );

	if ( dock === "top" || dock === "bottom" ) {
		let x = rect.width / 2;
		if ( settings.anchor === "left" ) { x = 0 + settings.padding; }
		else if ( settings.anchor === "right" ) { x = rect.width - settings.padding; }

		struct.x = x;
		struct.y = dock === "top" ? rect.height - settings.padding : settings.padding + textRect.height;
		struct.maxWidth = rect.width * 0.8;
	} else {
		let y = rect.height / 2;
		if ( settings.anchor === "top" ) { y = 0 + settings.padding; }
		else if ( settings.anchor === "bottom" ) { y = rect.height - settings.padding; }

		struct.y = y;
		struct.x = dock === "left" ? rect.width - settings.padding : settings.padding;
		const rotation = dock === "left" ? 270 : 90;
		struct.transform = `rotate(${rotation}, ${struct.x}, ${struct.y})`;
		struct.maxWidth = rect.height * 0.8;
	}

	return struct;
}

export function text( config, composer, renderer ) {
	let settings = extend( {
			anchor: "center",
			padding: 3,
			style: {
				fontSize: "15px",
				fontFamily: "Arial",
				fill: "#999"
			},
			join: ", "
		}, config.settings ),
		table = composer.table(),
		scale = config.scale ? composer.scale( config.scale ) : undefined,
		nodes = [],
		rect = { x: 0, y: 0, width: 0, height: 0 },
		dock = config.settings.dock,
		title;

	let fn = function() {
		title = parseTitle( config, table, scale );
		fn.dockConfig.requiredSize( calcRequiredSize( title, settings, renderer ) );
		fn.dockConfig.dock( dock );
		return fn;
	};

	fn.resize = ( inner ) => {
		renderer.size( inner );
		extend( rect, inner );
	};

	fn.render = () => {
		nodes.push( generateTitle( { title, settings, dock, rect, renderer } ) );
		renderer.render( nodes );
	};

	fn.dockConfig = dockConfig();

	return fn();
}
