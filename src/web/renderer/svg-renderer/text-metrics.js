let elm, measureCache = {};

function createCachedTextNode() {
	if ( elm === null || elm === undefined ) {
		elm = document.createElement( "span" );
		elm.style.position = "fixed";
		elm.style.left = "-1000px";
		elm.style.top = "-1000px";
		elm.style.overflow = "hidden";
		document.body.insertAdjacentElement( "beforeend", elm );
	}
}

export function measureText( { text, fontSize, fontFamily } ) {
	createCachedTextNode();
	const match = measureCache[text + fontSize + fontFamily];
	if ( match !== undefined ) {
		return match;
	} else {
		elm.style.display = "block";
		elm.textContent = text;
		elm.style["font-family"] = fontFamily;
		elm.style["font-size"] = fontSize;
		const rect = elm.getBoundingClientRect();
		elm.style.display = "none";
		measureCache[text + fontSize + fontFamily] = rect;
		return rect;
	}
}
