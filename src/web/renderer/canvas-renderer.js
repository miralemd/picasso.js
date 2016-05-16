let registry = {};

function renderShapes ( shapes, g ) {
	shapes.forEach( s => {
		if ( "fill" in s && g.fill !== s.fill ) {
			g.fillStyle = s.fill;
		}
		if ( registry[s.type] ) {
			registry[s.type]( s, g, "fill" in s, "stroke" in s );
		}
		if ( s.children ) {
			renderShapes( s.children, g );
		}
	} );
}

export default class CanvasRenderer {
	constructor( element ) {
		this.canvas = document.createElement( "canvas" );
		element.appendChild( this.canvas );
	}

	render( shapes ) {
		let c = this.canvas,
			el = c.parentElement,
			g = c.getContext( "2d" );

		if ( !el ) {
			return;
		}

		c.width = el.clientWidth;
		c.height = el.clientHeight;

		renderShapes( shapes, g );
	}

	static registerShape( name, renderFn ) {
		registry[name] = renderFn;
	}
}

CanvasRenderer.registerShape( "rect", ( s, g, fill, stroke ) => {
	if ( fill ) {
		g.fillRect( s.x, s.y, s.width, s.height );
	}
	if ( stroke ) {
		g.strokeRect( s.x, s.y, s.width, s.height );
	}
} );
