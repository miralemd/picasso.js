// import { AxisHelpers as helpers } from "../axis/axis-helpers";

export default class Text {
	constructor( config, composer, renderer ) {
		this.rect = { width: 0, height: 0, x: 0, y: 0 };
		this.data = composer.data;
		this.renderer = renderer;
		this.elements = [];

		this.settings( config.settings );
		const s = this.renderer.size();
		this.size( s.width, s.height );
		this.dock( config.dock );
		this.parseTitle( config );
		this.render();
	}

	settings() {
		this._settings = {
			align: "left",
			padding: 0,
			style: {
				"font-size": 15,
				"font-family": "Arial",
				color: "#999"
			}
		};
		// helpers.applyData( this._settings, opt );
		return this;
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
		if ( this._settings.align === "left" && this._dock === "left" ) { anchor = "end"; }
		else if ( this._settings.align === "left" ) { anchor = "start"; }
		else if ( this._settings.align === "right" && this._dock === "left" ) { anchor = "start"; }
		else if ( this._settings.align === "right" ) { anchor = "end"; }

		const struct = {
			type: "text",
			text: this.title,
			x: 0,
			y: 0,
			fill: this._settings.style.color,
			fontFamily: this._settings.style["font-family"],
			fontSize: this._settings.style["font-size"],
			anchor: anchor,
			baseline: "ideographic"
		};

		const ellipsOpt = { width: 0, text: struct.text, fontSize: this._settings.style["font-size"], font: this._settings.style["font-family"] };

		if ( this._dock === "top" || this._dock === "bottom" ) {
			let x = ( this.rect.width ) / 2;
			if ( this._settings.align === "left" ) { x = 0 + this._settings.padding; }
			else if ( this._settings.align === "right" ) { x = this.rect.width - this._settings.padding; }

			struct.x = x;
			struct.y = this._dock === "top" ? this.rect.y - this._settings.padding : this._settings.padding + this.renderer.measureText( struct ).height;
			ellipsOpt.width = this.rect.width / 1.2;
		} else {
			let y = ( this.rect.height ) / 2;
			if ( this._settings.align === "left" ) { y = 0 + this._settings.padding; }
			else if ( this._settings.align === "right" ) { y = this.rect.height - this._settings.padding; }

			struct.y = y;
			struct.x = this._dock === "left" ? -this._settings.padding : this._settings.padding;
			const rotation = this._dock === "left" ? 270 : 90;
			struct.transform = `rotate(${rotation} ${struct.x} ${struct.y})`;
			ellipsOpt.width = this.rect.height / 1.2;
		}

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
