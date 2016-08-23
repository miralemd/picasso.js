import { default as svgText } from "../../../web/renderer/svg-renderer/svg-text-helpers";

let rendererHelper = svgText;

export class AxisStructs {
	// TODO find a better solution..
	static setRenderer( r ) {
		rendererHelper = r;
	}

	static tick( tick, settings, rect ) {
		const struct = { type: "line", "stroke-width": settings.style.thickness, x1: 0, x2: 0,	y1: 0, y2: 0, stroke: settings.style.color };

		const halfWidth = struct["stroke-width"] / 2;

		if ( settings.dock === "top" || settings.dock === "bottom" ) {
			struct.x1 = tick.position * rect.width;
			struct.x2 = tick.position * rect.width;
			struct.y1 = 0;

			struct.y1 = settings.dock === "top" ? -settings.spacing : settings.spacing;
			struct.y2 = settings.dock === "top" ? struct.y1 - settings.style.size : struct.y1 + settings.style.size;

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
			struct.x2 = settings.dock === "left" ? struct.x1 - settings.style.size : struct.x1 + settings.style.size;

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

		// Apply base rotation so that getBoundingClientRect can be correctly calculated
		if ( settings.tilted ) {
			struct.transform = "rotate(-45)";
		}

		if ( settings.dock === "top" || settings.dock === "bottom" ) {
			struct.x = ( tick.position * rect.width );
			struct["text-anchor"] = "middle";

			const textWidth = rendererHelper.getComputedRect( struct ).width;
			if ( ( struct.x + rect.x ) <= textWidth ) {
				struct.x = ( textWidth / 2 ) - rect.x;
			} else if ( struct.x >= rendererRect.width - rect.x - textWidth ) {
				struct.x = rect.width - ( textWidth / 2 );
			}

			struct.y = settings.dock === "top" ? -settings.spacing : settings.spacing + settings.style.size;
		} else {
			struct.y = ( ( 1 - tick.position ) * rect.height );
			struct["text-anchor"] = settings.dock === "left" ? "end" : "start";

			const textHeight = rendererHelper.getComputedRect( struct ).height;
			if ( struct.y + rect.y <= textHeight ) {
				struct.y = textHeight - rect.y;
			} else if ( struct.y !== rendererRect.height - rect.y && struct.y <= rendererRect.height - rect.y ) {
				struct.y += textHeight / 3;
			}

			struct.x = settings.dock === "left" ? -settings.spacing : settings.spacing;
		}

		// Finalize transform
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

		const ellipsOpt = { width: 0, text: struct.text, fontSize: settings.style.size, font: settings.style.font };

		if ( settings.dock === "top" || settings.dock === "bottom" ) {
			struct.x = ( rect.width ) / 2;
			struct.y = settings.dock === "top" ? -settings.spacing : settings.spacing;
			ellipsOpt.width = rect.width / 1.5;
		} else {
			struct.y = rect.height / 2;
			struct.x = settings.dock === "left" ? -settings.spacing : settings.spacing;
			const rotation = settings.dock === "left" ? 270 : 90;
			struct.transform = `rotate(${rotation} ${struct.x} ${struct.y})`;
			ellipsOpt.width = rect.height / 1.5;
		}

		struct.text = rendererHelper.ellipsis( ellipsOpt );

		return struct;
	}
}
