import { default as svgText } from "../../../web/renderer/svg-renderer/svg-text-helpers";
import { AxisHelpers as helpers, AxisStructs } from "./axis-helpers";

export class Axis {
	// constructor( renderer, element, scale ) {
	constructor( axisConfig, composer, renderer ) {
		this.rect = { width: 0, height: 0, x: 0, y: 0 };
		this.scale = composer.scales[axisConfig.scale].scale;
		this.data = composer.data;
		this.source = composer.scales[axisConfig.scale].source;
		this.renderer = renderer();
		const element = document.getElementById( axisConfig.parent );
		this.renderer.rect.width = element.getBoundingClientRect().width;
		this.renderer.rect.height = element.getBoundingClientRect().height;
		this.renderer.appendTo( element );
		this.size( this.renderer.rect.width, this.renderer.rect.height );
		this.elements = [];
	}

	dock( value = "left" ) {
		if ( value === "left" ) {
			this.transform( this.renderer.rect.width, 0 );
		} else if ( value === "right" ) {
			this.transform( 0, 0 );
		} else if ( value === "bottom" ) {
			this.transform( 0, 0 );
		} else if ( value === "top" ) {
			this.transform( 0, this.renderer.rect.height );
		}

		this._dock = value;
		return this;
	}

	size( width, height ) {
		this.rect.height = height;
		this.rect.width = width;
		return this;
	}

	transform( x, y ) {
		this.renderer.g.setAttribute( "transform", `translate(${x}, ${y})` );
		this.rect.x = x;
		this.rect.y = y;
		return this;
	}

	generateLine() {
		this._settings.line.dock = this._dock;
		if ( this._settings.line.show ) {
			this.elements.push( AxisStructs.line( this._settings.line, this.rect ) );
		}
	}

	generateTicks() {
		this._settings.ticks.dock = this._dock;
		this._settings.ticks.spacing = helpers.tickSpacing( this._settings );

		this._ticks.forEach( tick => {
			if ( this._settings.ticks.show ) {
				this.elements.push( AxisStructs.tick( tick, this._settings.ticks, this.rect ) );
			}
		} );
	}

	generateMinorTicks() {
		this._settings.minorTicks.dock = this._dock;
		this._settings.minorTicks.spacing = helpers.tickMinorSpacing( this._settings );

		this._ticks.forEach( tick => {
			if ( this._settings.ticks.show ) {
				if ( this._settings.minorTicks.show ) {
					tick.minor.forEach( minor => {
						this.elements.push( AxisStructs.tick( minor, this._settings.minorTicks, this.rect ) );
					} );
				}
			}
		} );
	}

	generateLabels() {
		this._settings.labels.dock = this._dock;
		this._settings.labels.direction = this._settings.direction;
		this._settings.labels.spacing = helpers.labelsSpacing( this._settings );
		this._settings.labels.bandWidth = helpers.labelsBandwidth( this._dock, this._settings.labels, this._ticks, this.rect );
		this._ticks.forEach( ( tick ) => {
			if ( this._settings.labels.show ) {
				tick.label = svgText.ellipsis( 3, this._settings.labels.bandWidth.width, tick.label, this._settings.labels.style.size, this._settings.labels.style.font );
				this.elements.push( AxisStructs.label( tick, this._settings.labels, this.rect, this.renderer.rect ) );
			}
		 } );
	}

	generateTitle() {
		this._settings.title.dock = this._dock;
		this._settings.title.direction = this._settings.direction;
		this._settings.title.spacing = helpers.titleSpacing( this._settings, this._ticks, this._dock );
		this.elements.push( AxisStructs.title( this._settings.title, this.rect ) );
	}

	render( ) {
		this.onData();
		this.generateLine();
		this.generateTicks();
		this.generateMinorTicks();
		this.generateLabels();
		this.generateTitle();

		this.renderer.render( this.elements );
	}
}
