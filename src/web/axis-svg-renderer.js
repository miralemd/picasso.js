import { renderer } from "./renderer/svg-renderer/svg-renderer";
import { linear } from "../core/scales/linear";
import { axisContinuous } from "../core/chart-components/axis/axis-continuous";

function adjustTickForDock( dock, tick, tickSize, rect ) {
	let line = { type: "line", "stroke-width": 1, x1: 0, x2: 0,	y1: 0, y2: 0, stroke: "#999" };

	if ( dock === "top" || dock === "bottom" ) {
		line.x1 = tick.position * rect.width;
		line.x2 = tick.position * rect.width;
		line.y1 = 0;

		if ( dock === "top" ) {
			line.y2 = -tickSize;
		} else {
			line.y2 = tickSize;
		}
	} else {
		line.x1 = 0;
		line.y1 = ( 1 - tick.position ) * rect.height;
		line.y2 = ( 1 - tick.position ) * rect.height;

		if ( dock === "left" ) {
			line.x2 = -tickSize;
		} else {
			line.x2 = tickSize;
		}
	}

	return line;
}

function adjustLabelForDock( dock, tick, padding, rect ) {
	let label = { type: "text", text: tick.label, x: 0,	y: 0, fill: "#999",	"font-family": "Arial",	"font-size": 13	};

	if ( dock === "top" || dock === "bottom" ) {
		label.x = ( tick.position * rect.width ); //+ ( tick.index === 0 ? 11 : 5 );

		if ( dock === "top" ) {
			label.y = -padding;
		} else {
			label.y = padding;
		}
	} else {
		label.y = ( ( 1 - tick.position ) * rect.height ); //+ ( tick.index === 0 ? 11 : 5 );

		if ( dock === "left" ) {
			label.x = -padding;
		} else {
			label.x = padding;
		}
	}

	return label;
}

function adjustDomainForDock( dock, rect ) {
	let line = { type: "line", "stroke-width": 1, x1: 0, x2: 0, y1: 0, y2: 0, stroke: "#999" };
	if ( dock === "top" || dock === "bottom" ) {
		line.x2 = rect.width;
	} else {
		line.y2 = rect.height;
	}

	return line;
}

export class Axis {
	constructor( element, scale ) {
		this.rect = { width: 0, height: 0, x: 0, y: 0 };
		this.axis = axisContinuous( scale );
		this.renderer = renderer();
		this.renderer.rect.width = element.getBoundingClientRect().width;
		this.renderer.rect.height = element.getBoundingClientRect().height;
		this.renderer.appendTo( element );
		this.size( this.renderer.rect.width, this.renderer.rect.height );
		this.elements = [];
		this._allYourBasesBelongToUs = linear().clamp();
		this.format();
		this.ticks( 5 );
	}

	dock( value = "left" ) {
		if ( value === "left" ) {
			this.renderer.g.setAttribute( "text-anchor", "end" );
			this.renderer.g.setAttribute( "transform", `translate(${this.renderer.rect.width}, 0)` );
			this._allYourBasesBelongToUs.range( [5, 25] );
		} else if ( value === "right" ) {
			this.renderer.g.setAttribute( "text-anchor", "start" );
			this.renderer.g.setAttribute( "transform", "translate(0, 0)" );
			this._allYourBasesBelongToUs.range( [5, 25] );
		} else if ( value === "bottom" ) {
			this.renderer.g.setAttribute( "text-anchor", "middle" );
			this.renderer.g.setAttribute( "transform", "translate(0, 0)" );
			this._allYourBasesBelongToUs.range( [20, 40] );
		} else if ( value === "top" ){
			this.renderer.g.setAttribute( "text-anchor", "middle" );
			this.renderer.g.setAttribute( "transform", `translate(0, ${this.renderer.rect.height})` );
			this._allYourBasesBelongToUs.range( [10, 25] );
		}

		this._dock = value;
		this.padding();
		this.tickSize();
		return this;
	}

	size( width, height ) {
		this.rect.height = height;
		this.rect.width = width;
		return this;
	}

	// value [0-1]
	padding( value = 0.5 ) {
		this._outerPadding = this._allYourBasesBelongToUs.get( value );
		return this;
	}

	// value [0-1]
	tickSize( value = 0.5 ) {
		this._allYourBasesBelongToUs.range( [5, 15] );
		this._tickSize = this._allYourBasesBelongToUs.get( value );
		return this;
	}

	format( formatter = "s" ) {
		if ( arguments.length <= 0 ) {
			return this._formatter;
		}
		this._formatter = formatter;
		return this;
	}

	nice( count = 10 ) {
		this.axis.nice( count );
		return this;
	}

	ticks( count ) {
		this._ticks = this.axis.ticks( count );
		return this;
	}

	margin( x, y ) {
		this.renderer.g.setAttribute( "transform", `translate(${x}, ${y})` );
		return this;
	}

	render() {
		this._ticks.forEach( tick => {
			this.elements.push( adjustTickForDock( this._dock, tick, this._tickSize, this.rect ) );
			this.elements.push( adjustLabelForDock( this._dock, tick, this._outerPadding, this.rect ) );

			tick.minor.forEach( minor => {
				this.elements.push( adjustTickForDock( this._dock, minor, 3, this.rect ) );
			} );
		} );

		this.elements.push( adjustDomainForDock( this._dock, this.rect ) );

		this.renderer.render( this.elements );
	}
}

export function axis( ...a ) {
	return new Axis( ...a );
}
