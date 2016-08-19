import { default as svgText } from "../../../web/renderer/svg-renderer/svg-text-helpers";

export class AxisStructs {
	static tick( tick, settings, rect ) {
		const struct = { type: "line", "stroke-width": settings.style.thickness, x1: 0, x2: 0,	y1: 0, y2: 0, stroke: settings.style.color };

		const halfWidth = struct["stroke-width"] / 2;

		if ( settings.dock === "top" || settings.dock === "bottom" ) {
			struct.x1 = tick.position * rect.width;
			struct.x2 = tick.position * rect.width;
			struct.y1 = 0;

			struct.y1 = settings.dock === "top" ? -settings.spacing : settings.spacing;
			struct.y2 = settings.dock === "top" ? -settings.style.size - settings.spacing : settings.style.size + settings.spacing;

			// make sure the whole line is rendered
			if ( struct.x1 === rect.width ) { // outer end tick
				struct.x1 -= halfWidth;
				struct.x2 -= halfWidth;
			} else if ( struct.x1 === 0 ) { // outer start tick
				struct.x1 += halfWidth;
				struct.x2 += halfWidth;
			}
		} else {
			struct.x1 = 0;
			struct.y1 = ( 1 - tick.position ) * rect.height;
			struct.y2 = ( 1 - tick.position ) * rect.height;

			struct.x1 = settings.dock === "left" ? -settings.spacing : settings.spacing;
			struct.x2 = settings.dock === "left" ? -settings.style.size - settings.spacing : settings.style.size + settings.spacing;

			// make sure the whole line is rendered
			if ( struct.y1 === rect.height ) {
				struct.y1 -= halfWidth;
				struct.y2 -= halfWidth;
			} else if ( struct.y1 === 0 ) {
				struct.y1 += halfWidth;
				struct.y2 += halfWidth;
			}
		}

		return struct;
	}

	static label( tick, settings, rect, rendererRect ) {
		const struct = {
			type: "text",
			text: tick.label,
			x: 0,
			y: 0,
			fill: settings.style.color,
			"font-family": settings.style.font,
			"font-size": settings.style.size,
			direction: settings.direction
		};

		if ( settings.dock === "top" || settings.dock === "bottom" ) {
			struct.x = ( tick.position * rect.width );
			struct["text-anchor"] = "middle";

			const textWidth = svgText.measureText( struct.text ).width;
			if ( ( struct.x + rect.x ) <= textWidth ) {
				// this.svg.x = label.x + textWidth / 2;
				struct.x = ( textWidth / 2 ) - rect.x;
			} else if ( struct.x >= rendererRect.width - rect.x - textWidth ) {
				// this.svg.x = label.x - textWidth / 2;
				struct.x = rect.width - ( textWidth / 2 );
			}

			struct.y = settings.dock === "top" ? -settings.spacing : settings.spacing + settings.style.size;
		} else {
			struct.y = ( ( 1 - tick.position ) * rect.height );
			struct["text-anchor"] = settings.dock === "left" ? "end" : "start";

			const textHeight = settings.style.size;
			if ( struct.y + rect.y <= textHeight ) {
				struct.y = textHeight - rect.y;
			// } else if ( struct.y >= rendererRect.height - rect.y ) {
			// 	struct.y = struct.y; // - textHeight / 4;
			} else if ( struct.y !== rendererRect.height - rect.y && struct.y <= rendererRect.height - rect.y ) {
				struct.y += textHeight / 3;
			}

			struct.x = settings.dock === "left" ? -settings.spacing : settings.spacing;
		}

		if ( settings.tilted ) {
			struct.transform = `rotate(-45, ${struct.x}, ${struct.y})`;
		}

		return struct;
	}

	static line( settings, rect ) {
		const struct = {
			type: "line",
			"stroke-width": settings.style.size,
			x1: 0,
			x2: 0,
			y1: 0,
			y2: 0,
			stroke: settings.style.color
		 };

		 const halfWidth = settings.style.size / 2;

		 if ( settings.dock === "top" || settings.dock === "bottom" ) {
			 struct.x2 = rect.width;
			 struct.y1 = settings.dock === "top" ? -halfWidth : halfWidth;
			 struct.y2 = settings.dock === "top" ? -halfWidth : halfWidth;
		 } else {
			 struct.y2 = rect.height;
			 struct.x1 = settings.dock === "left" ? -halfWidth : halfWidth;
			 struct.x2 = settings.dock === "left" ? -halfWidth : halfWidth;
		 }

		 return struct;
	}

	static title( settings, rect ) {
		const struct = {
			type: "text",
			text: settings.value,
			x: 0,
			y: 0,
			fill: settings.style.color,
			"font-family": settings.style.font,
			"font-size": settings.style.size,
			direction: settings.direction,
			"text-anchor": "middle"
		};

		if ( settings.dock === "top" || settings.dock === "bottom" ) {
			struct.x = ( rect.width ) / 2;
			struct.y = settings.dock === "top" ? -settings.spacing : settings.spacing;
			struct.text = svgText.ellipsis( 3, rect.width / 1.5, struct.text, settings.style.size, settings.style.font );
		} else {
			struct.y = rect.height / 2;
			struct.x = settings.dock === "left" ? -settings.spacing : settings.spacing;
			const rotation = settings.dock === "left" ? 270 : 90;
			struct.transform = `rotate(${rotation} ${struct.x} ${struct.y})`;
			struct.text = svgText.ellipsis( 3, rect.height / 1.5, struct.text, settings.style.size, settings.style.font );
		}

		return struct;
	}
}

export class AxisHelpers {
	static tickSpacing( settings ) {
		return settings.line.style.size + settings.ticks.padding;
	}

	static tickMinorSpacing( settings ) {
		return settings.line.style.size + settings.minorTicks.padding;
	}

	static labelsSpacing( settings ) {
		let spacing = 0;
		spacing += settings.ticks.show ? settings.ticks.style.size : 0;
		spacing += AxisHelpers.tickSpacing( settings ) + settings.labels.padding;
		return spacing;
	}

	static titleSpacing( settings, ticks, dock ) {
		let spacing = 0;
		spacing += settings.labels.show ? AxisHelpers.labelsSpacing( settings ) + settings.title.padding : settings.title.padding;
		if ( dock === "bottom" ) {
			spacing += settings.labels.style.size * 2;
		} else if ( dock === "top" ){
			spacing += settings.labels.style.size;
		} else {
			const maxTextLength = Math.max.apply( this, ticks.map( ( t ) => svgText.measureText( t.label ).width ) );
			spacing += maxTextLength;
		}
		return spacing;
	}

	static labelsBandwidth( dock, settings, ticks, rect ) {
		const innerPadding = 0.75;
		const bandWidth = { width: 0, height: 0 };
		bandWidth.height = ( rect.height / ticks.length ) * innerPadding;
		if ( dock === "left" || dock === "right" ) {
			bandWidth.width = ( rect.width - settings.spacing ) * innerPadding;
		} else {
			bandWidth.width = ( rect.width / ticks.length ) * innerPadding;
		}

		return bandWidth;
	}

	static applyData( target, data ) {
		for ( let d in data ) {
			if ( data.hasOwnProperty( d ) ) {
				if ( typeof data[d] === "object" && !Array.isArray( data[d] ) ) {
					target[d] = AxisHelpers.applyData( target[d], data[d] );
				} else {
					target[d] = data[d];
				}
			}
		}
		return target;
	}
}
