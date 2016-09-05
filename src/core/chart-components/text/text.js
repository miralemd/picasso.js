import { default as svgTextHelper } from "../../../web/renderer/svg-renderer/svg-text-helpers";

export default class Text {
	constructor( config, composer, renderer ) {
		this.rect = { width: 0, height: 0, x: 0, y: 0 };
		this.data = composer.data;
		this.renderer = renderer;
		this.elements = [];
		this.settings = config.settings;

		this.size( this.renderer.rect.width, this.renderer.rect.height );
		this.dock( config.dock );
		this.parseTitle( config );
		this.render();
	}

	parseTitle( config ) {
		if ( typeof config.text === "function" ) {
			this.title = config.text( this.data );
		} else if ( typeof config.text === "string" ) {
			this.title = config.text;
		} else if ( config.text.hasOwnProperty( "source" ) ) {
			const source = config.text.source;
			if ( Array.isArray( source ) ) {
				this.title = source.map( ( s ) => {
					return this.data.metaOf( s ).title; } )
						.join( config.settings.join || ", " );
			} else {
				this.title = this.data.metaOf( source ).title;
			}
		} else {
			this.title = "";
		}
	}

	size( width, height ) {
		this.rect.height = height;
		this.rect.width = width;
		return this;
	}

	transform( x, y ) {
		this.renderer.g.setAttribute( "transform", `translate(${x}, ${y})` ); // TODO svg render specific code
		this.rect.x = x;
		this.rect.y = y;
		return this;
	}

	dock( value = "left" ) {
		if ( value === "left" ) {
			this.transform( this.rect.width, 0 );
		} else if ( value === "right" ) {
			this.transform( 0, 0 );
		} else if ( value === "bottom" ) {
			this.transform( 0, 0 );
		} else if ( value === "top" ) {
			this.transform( 0, this.rect.height );
		}

		this._dock = value;
		return this;
	}

	generateTitle() {
		let anchor = "middle";
		if ( this.settings.align === "left" ) { anchor = "start"; }
		else if ( this.settings.align === "right" ) { anchor = "end"; }

		const struct = {
			type: "text",
			text: this.title,
			x: 0,
			y: 0,
			fill: this.settings.style.color,
			"font-family": this.settings.style["font-family"],
			"font-size": this.settings.style["font-size"],
			"text-anchor": anchor,
			"alignment-baseline": "ideographic"
		};

		const ellipsOpt = { width: 0, text: struct.text, fontSize: this.settings.style.size, font: this.settings.style.font };

		if ( this._dock === "top" || this._dock === "bottom" ) {
			let x = ( this.rect.width ) / 2;
			if ( this.settings.align === "left" ) { x = 0 + this.settings.padding; }
			else if ( this.settings.align === "right" ) { x = this.rect.width - this.settings.padding; }

			struct.x = x;
			struct.y = this._dock === "top" ? -this.settings.padding : this.settings.padding + svgTextHelper.getComputedRect( struct ).height;
			ellipsOpt.width = this.rect.width / 1.5;
		} else {
			let y = ( this.rect.height ) / 2;
			if ( this.settings.align === "left" ) { y = 0 + this.settings.padding; }
			else if ( this.settings.align === "right" ) { y = this.rect.height - this.settings.padding; }

			struct.y = y;
			struct.x = this._dock === "left" ? -this.settings.padding : this.settings.padding;
			const rotation = this._dock === "left" ? 270 : 90;
			struct.transform = `rotate(${rotation} ${struct.x} ${struct.y})`;
			ellipsOpt.width = this.rect.height / 1.5;
		}

		struct.text = svgTextHelper.ellipsis( ellipsOpt );

		return struct;
	}

	render() {
		const struct = this.generateTitle();
		this.renderer.render( [struct] );
		return this;
	}
}

export function text( ...a ) {
	return new Text( ...a );
}
