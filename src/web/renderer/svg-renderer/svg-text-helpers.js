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

	getComputedTextLength( text, fontSize, font ) {
		const struct = { type: "text", text: text, x: 0, y: 0, "font-family": font,	"font-size": fontSize, fill: "white" };
		return this.getComputedRect( struct ).width;
	},

	ellipsis( opt ) {
		opt.reduce = opt.reduce ? opt.reduce : 3; // TODO doesnt make sense with recoursive call where 4 is hard-coded
		opt.reduceChars = opt.reduceChars ? opt.reduceChars : "...";

		let textLength = this.getComputedTextLength( opt.text, opt.fontSize, opt.font );
		if ( textLength > opt.width && opt.text !== "..." ) {
			opt.text = opt.text.substr( 0, opt.text.length - opt.reduce );
			opt.text += opt.reduceChars;
			opt.reduce = 4;
			return this.ellipsis( opt );
		}
		return opt.text;
	}
};
