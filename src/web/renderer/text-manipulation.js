export function ellipsText( { text, "font-size": fontSize, "font-family": fontFamily, maxWidth }, measureText ) {
	const reduceChars = "…";
	text = typeof text === "string" ? text : text.toString();
	let textWidth = measureText( { text, fontSize, fontFamily } ).width;
	let reduceIndex = -1;
	while ( textWidth > maxWidth && text !== reduceChars ) {
		reduceIndex = reduceIndex === -1 ? text.length - 1 : reduceIndex - 1;
		text = text.substr( 0, reduceIndex );
		text += reduceChars;
		textWidth = measureText( { text, fontSize, fontFamily } ).width;
	}
	return text;
}
