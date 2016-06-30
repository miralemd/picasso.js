import { renderer } from "./renderer/svg-renderer/svg-renderer";
import { linear } from "../core/scales/linear";
import { axisContinuous } from "../core/chart-components/axis-continuous";

function innerRepresentationTop( axis, count, index, tick ) {
	const rV = axis.scale.get( tick );
	const x1 = rV * axis.rect.width;
	const x2 = rV * axis.rect.width;
	const y1 = 0;
	const y2 = -axis.__innerSize;
	return {
		type: "line",
		"stroke-width": 1,
		x1: x1,
		x2: x2,
		y1: y1,
		y2: y2,
		stroke: axis.__color
	};
}

function innerRepresentationBottom( axis, count, index, tick ) {
	const rV = axis.scale.get( tick );
	const x1 = rV * axis.rect.width;
	const x2 = rV * axis.rect.width;
	const y1 = 0;
	const y2 = axis.__innerSize;
	return {
		type: "line",
		"stroke-width": 1,
		x1: x1,
		x2: x2,
		y1: y1,
		y2: y2,
		stroke: axis.__color
	};
}

function innerRepresentationLeft( axis, count, index, tick ) {
	const rV = axis.scale.get( tick );
	const x1 = 0;
	const x2 = -axis.__innerSize;
	const y1 = rV * axis.rect.height;
	const y2 = rV * axis.rect.height;
	return {
		type: "line",
		"stroke-width": 1,
		x1: x1,
		x2: x2,
		y1: y1,
		y2: y2,
		stroke: axis.__color
	};
}

function innerRepresentationRight( axis, count, index, tick ) {
	const rV = axis.scale.get( tick );
	const x1 = 0;
	const x2 = axis.__innerSize;
	const y1 = rV * axis.rect.height;
	const y2 = rV * axis.rect.height;
	return {
		type: "line",
		"stroke-width": 1,
		x1: x1,
		x2: x2,
		y1: y1,
		y2: y2,
		stroke: axis.__color
	};
}

function outerRepresentationLeft( axis, count, index, tick ) {
	const rV = axis.scale.get( tick );
	const formatter = axis.scale.tickFormat( count, "s" );
	const ticksFormatted = axis._ticks.map( formatter );
	const x = -axis.__outerPadding;
	const y = ( rV * axis.rect.height ) + ( index === 0 ? 11 : 5 );
	return {
		type: "text",
		text: ticksFormatted[index],
		x: x,
		y: y,
		fill: axis.__color,
		"font-family": "Arial",
		"font-size": 13
	};
}

function outerRepresentationRight( axis, count, index, tick ) {
	const rV = axis.scale.get( tick );
	const formatter = axis.scale.tickFormat( count, "s" );
	const ticksFormatted = axis._ticks.map( formatter );
	const x = axis.__outerPadding;
	const y = ( rV * axis.rect.height ) + ( index === 0 ? 11 : 5 );
	return {
		type: "text",
		text: ticksFormatted[index],
		x: x,
		y: y,
		fill: axis.__color,
		"font-family": "Arial",
		"font-size": 13
	};
}

function outerRepresentationBottom( axis, count, index, tick ) {
	const rV = axis.scale.get( tick );
	const formatter = axis.scale.tickFormat( count, "s" );
	const ticksFormatted = axis._ticks.map( formatter );
	const x = ( rV * axis.rect.width ) + ( index === 0 ? 5 : 0 );
	const y = axis.__outerPadding;
	return {
		type: "text",
		text: ticksFormatted[index],
		x: x,
		y: y,
		fill: axis.__color,
		"font-family": "Arial",
		"font-size": 13
	};
}

function outerRepresentationTop( axis, count, index, tick ) {
	const rV = axis.scale.get( tick );
	const formatter = axis.scale.tickFormat( count, "s" );
	const ticksFormatted = axis._ticks.map( formatter );
	const x = ( rV * axis.rect.width ) + ( index === 0 ? 10 : 0 );
	const y = -axis.__outerPadding;
	return {
		type: "text",
		text: ticksFormatted[index],
		x: x,
		y: y,
		fill: axis.__color,
		"font-family": "Arial",
		"font-size": 13
	};
}

function domainRepresentationLeft( axis ) {
	return {
		type: "line",
		"stroke-width": 1,
		x1: 0,
		x2: 0,
		y1: 0,
		y2: axis.rect.height,
		stroke: axis.__color
	};
}

function domainRepresentationBottom( axis ) {
	return {
		type: "line",
		"stroke-width": 1,
		x1: 0,
		x2: axis.rect.width,
		y1: 0,
		y2: 0,
		stroke: axis.__color
	};
}

export class Axis {
	constructor( element, scale ) {
		this.axis = axisContinuous( scale );
		this.renderer = renderer();
		this.renderer.rect.width = element.getBoundingClientRect().width;
		this.renderer.rect.height = element.getBoundingClientRect().height;
		this.renderer.appendTo( element );
		this.color = "#999";
		this.axis.__color = this.color;
		this.elements = [];
		this._allYourBasesBelongToUs = linear().clamp();
	}

	size( height, width ) {
		this.axis.rect.height = height;
		this.axis.rect.width = width;
		return this;
	}

	// value [0-1]
	padding( value = 0.5 ) {
		this.axis.__outerPadding = this._allYourBasesBelongToUs.invert( value );
		return this;
	}

	// value [0-1]
	tickSize( value = 0.5 ) {
		this._allYourBasesBelongToUs.domain( [5, 15] );
		this.axis.__innerSize = this._allYourBasesBelongToUs.invert( value );
		return this;
	}

	ticks( count, nice = true ) {
		const ticks = this.axis.ticks( count, nice );
		ticks.forEach( ( tick ) => {
			this.elements.push( ...[tick.inner, tick.outer] );

			// tick.minor.forEach( ( m ) => {
			// 	const minor = {
			// 		type: "line",
			// 		"stroke-width": 1,
			// 		x1: m.rect.x,
			// 		x2: this.axis.isVertical ? -m.rect.x - ( this._innerSize / 2 ) : m.rect.x,
			// 		y1: m.rect.y,
			// 		y2: !this.axis.isVertical ? m.rect.y + ( this._innerSize / 2 ) : m.rect.y,
			// 		stroke: this.color
			// 	};
			// 	this.elements.push( minor );
			// } );
		} );

		return this;
	}

	margin( x, y ) {
		this.renderer.g.setAttribute( "transform", `translate(${x}, ${y})` );
		return this;
	}

	render() {
		this.elements.push( this.axis.domain() );

		this.renderer.render( this.elements );
	}
}

export class AxisLeft extends Axis {
	constructor( element, scale ) {
		super( element, scale );
		this.axis.innerRepresentation( innerRepresentationLeft );
		this.axis.outerRepresentation( outerRepresentationLeft );
		this.axis.domainRepresentation( domainRepresentationLeft );
		this.renderer.g.setAttribute( "text-anchor", "end" );
		this.renderer.g.setAttribute( "transform", `translate(${this.renderer.rect.width}, 0)` );
		this.padding();
		this.tickSize();
	}

	padding( value = 0.5 ){
		this._allYourBasesBelongToUs.domain( [5, 25] );
		super.padding( value );
		return this;
	}
}

export class AxisRight extends Axis {
	constructor( element, scale ) {
		super( element, scale );
		this.axis.innerRepresentation( innerRepresentationRight );
		this.axis.outerRepresentation( outerRepresentationRight );
		this.axis.domainRepresentation( domainRepresentationLeft );
		this.renderer.g.setAttribute( "text-anchor", "start" );
		this.renderer.g.setAttribute( "transform", "translate(0, 0)" );
		this.padding();
		this.tickSize();
	}

	padding( value = 0.5 ){
		this._allYourBasesBelongToUs.domain( [5, 25] );
		super.padding( value );
		return this;
	}
}

export class AxisBottom extends Axis {
	constructor( element, scale ) {
		super( element, scale );
		this.axis.innerRepresentation( innerRepresentationBottom );
		this.axis.outerRepresentation( outerRepresentationBottom );
		this.axis.domainRepresentation( domainRepresentationBottom );
		this.renderer.g.setAttribute( "text-anchor", "middle" );
		this.renderer.g.setAttribute( "transform", "translate(0, 0)" );
		this.padding();
		this.tickSize();
	}

	padding( value = 0.5 ) {
		this._allYourBasesBelongToUs.domain( [20, 40] );
		super.padding( value );
		return this;
	}
}

export class AxisTop extends Axis {
	constructor( element, scale ) {
		super( element, scale );
		this.axis.innerRepresentation( innerRepresentationTop );
		this.axis.outerRepresentation( outerRepresentationTop );
		this.axis.domainRepresentation( domainRepresentationBottom );
		this.renderer.g.setAttribute( "text-anchor", "middle" );
		this.renderer.g.setAttribute( "transform", `translate(0, ${this.renderer.rect.height})` );
		this.padding();
		this.tickSize();
	}

	padding( value = 0.5 ) {
		this._allYourBasesBelongToUs.domain( [10, 25] );
		super.padding( value );
		return this;
	}
}

export function axis() {
	return {};
}

axis.left = ( ...a ) => {
	return new AxisLeft( ...a );
};

axis.right = ( ...a ) => {
	return new AxisRight( ...a );
};

axis.bottom = ( ...a ) => {
	return new AxisBottom( ...a );
};

axis.top = ( ...a ) => {
	return new AxisTop( ...a );
};
