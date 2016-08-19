/** @module web/renderer/svg-renderer/svg-text-helpers */

export default {
	measureText( text, fontSize = 13, font = "Arial" ) {
		const tempCanvas = document.createElement( "canvas" );
		document.body.insertAdjacentElement( "beforeend", tempCanvas );
		const ctx = tempCanvas.getContext( "2d" );
		ctx.font = `${fontSize}px ${font}`;
		const textSize = ctx.measureText( text );
		document.body.removeChild( tempCanvas );
		return textSize;
	},

	ellipsis( reduce, width, text, fontSize = 13, font = "Arial" ) {
		let textLength = this.measureText( text, fontSize, font ).width;
		if ( textLength > width && text !== "..." ) {
			let ellipsedText = text.substr( 0, text.length - reduce );
			ellipsedText += "...";
			return this.ellipsis( 4, width, ellipsedText, fontSize, font );
		}
		return text;
	}
};
