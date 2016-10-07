/** @module web/renderer/svg-renderer/svg-nodes */

import { measureText } from "./text-metrics";
import { ellipsText } from "../text-manipulation";

const svgNs = "http://www.w3.org/2000/svg";

const creator = ( type, parent ) => {
	if ( !type || typeof type !== "string" ) {
		throw new Error( `Invalid type: ${type}` );
	}
	let el = parent.ownerDocument.createElementNS( svgNs, type );
	parent.appendChild( el );
	return el;
};

const destroyer = el => {
	if ( el.parentNode ) {
		el.parentNode.removeChild( el );
	}
};

const maintainer = ( element, item ) => {
	for ( let attr in item ) {
		if ( /^_/.test( attr ) || ["id", "data", "type", "children"].indexOf( attr ) !== -1 ) {
			continue;
		}
		if ( attr === "text" ) {
			element.textContent = ellipsText( item, measureText );
			continue;
		}
		element.setAttribute( attr, item[attr] );
	}
};

export {
  svgNs,
  creator,
  maintainer,
  destroyer
};
