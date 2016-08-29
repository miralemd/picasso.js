/** @module web/renderer/svg-renderer/svg-text-helpers */

import { renderer } from "./svg-renderer";

export default {
	getComputedRect( textStruct ) {
		const tmpDiv = document.createElement( "div" );
		document.body.insertAdjacentElement( "beforeend", tmpDiv );
		const rend = renderer();
		rend.appendTo( tmpDiv );
		rend.render( [textStruct] );
		const rect = tmpDiv.getElementsByTagName( "text" )[0].getBBox();
		document.body.removeChild( tmpDiv );
		return rect;
	},

	getComputedTextLength( text, fontSize, font, rotation = 0 ) {
		const struct = { type: "text", text: text, x: 0, y: 0, "font-family": font,	"font-size": fontSize, fill: "white", transform: `rotate(${rotation})` };
		const tmpDiv = document.createElement( "div" );
		document.body.insertAdjacentElement( "beforeend", tmpDiv );
		const rend = renderer();
		rend.appendTo( tmpDiv );
		rend.render( [struct] );
		const rect = tmpDiv.getElementsByTagName( "text" )[0].getComputedTextLength();
		document.body.removeChild( tmpDiv );
		return rect;
	},

	ellipsis( opt ) {
		opt.reduce = opt.reduce ? opt.reduce : 1; // TODO doesnt make sense with recoursive call where 4 is hard-coded
		opt.reduceChars = opt.reduceChars ? opt.reduceChars : "…";

		let textLength = this.getComputedTextLength( opt.text, opt.fontSize, opt.font );
		if ( textLength > opt.width && opt.text !== "…" ) {
			opt.text = opt.text.substr( 0, opt.text.length - opt.reduce );
			opt.text += opt.reduceChars;
			opt.reduce = 2;
			return this.ellipsis( opt );
		}
		return opt.text;
	}
};
