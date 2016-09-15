export function render( t, { g } ) {
	g.beginPath();
	g.font = `${t["font-size"]}px ${t["font-family"]}`;
	g.textAlign = t["text-anchor"] === "middle" ? "center" : t["text-anchor"];
	g.textBaseline = t.baseline;
	g.fillText( t.text, t.x, t.y );
}
