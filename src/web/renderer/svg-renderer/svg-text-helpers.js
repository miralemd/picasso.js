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

	ellipsis( opt ) {
		let textLength = this.measureText( opt.text, opt.fontSize, opt.font ).width;
		if ( textLength > opt.width && opt.text !== "..." ) {
			opt.text = opt.text.substr( 0, opt.text.length - opt.reduce );
			opt.text += "...";
			opt.reduce = 4;
			return this.ellipsis( opt );
		}
		return opt.text;
	}
};
