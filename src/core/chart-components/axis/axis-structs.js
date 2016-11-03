import { default as extend } from "extend";

export function buildTick( tick, buildOpts ) {
	const struct = {
		type: "line",
		x1: 0, x2: 0, y1: 0, y2: 0
	};

	if ( buildOpts.align === "top" || buildOpts.align === "bottom" ) {
		struct.x1 = struct.x2 = ( tick.position * buildOpts.innerRect.width ) + buildOpts.innerRect.x - buildOpts.outerRect.x;
		struct.y1 = buildOpts.align === "top" ? buildOpts.innerRect.height : 0;
		struct.y2 = buildOpts.align === "top" ? struct.y1 - buildOpts.tickSize : struct.y1 + buildOpts.tickSize;
	} else {
		struct.y1 = struct.y2 = ( tick.position ) * ( buildOpts.innerRect.height ) + buildOpts.innerRect.y - buildOpts.outerRect.y;
		struct.x1 = buildOpts.align === "left" ? buildOpts.innerRect.width : 0;
		struct.x2 = buildOpts.align === "left" ? struct.x1 - buildOpts.tickSize : struct.x1 + buildOpts.tickSize;
	}

	let tickApplyStyle = () => {
		extend( struct, buildOpts.style );
	};

	let tickApplyPadding = () => {
		if ( buildOpts.align === "top" ) {
			struct.y1 -= buildOpts.padding;
			struct.y2 -= buildOpts.padding;
		} else if ( buildOpts.align === "bottom" ) {
			struct.y1 += buildOpts.padding;
			struct.y2 += buildOpts.padding;
		} else if ( buildOpts.align === "left" ) {
			struct.x1 -= buildOpts.padding;
			struct.x2 -= buildOpts.padding;
		} else if ( buildOpts.align === "right" ) {
			struct.x1 += buildOpts.padding;
			struct.x2 += buildOpts.padding;
		}
	};

	let tickAdjustForEnds = () => {
		const halfWidth = struct.strokeWidth / 2;

		if ( struct.x1 === buildOpts.innerRect.width ) { // outer end tick
			struct.x1 -= halfWidth;
			struct.x2 -= halfWidth;
		} else if ( struct.x1 === 0 ) { // outer start tick
			struct.x1 += halfWidth;
			struct.x2 += halfWidth;
		} else if ( struct.y1 === buildOpts.innerRect.height ) {
			struct.y1 -= halfWidth;
			struct.y2 -= halfWidth;
		} else if ( struct.y1 === 0 ) {
			struct.y1 += halfWidth;
			struct.y2 += halfWidth;
		}
	};

	tickApplyStyle();
	tickApplyPadding();
	tickAdjustForEnds();
	return struct;
}

export function buildLabel( tick, buildOpts ) {
	const struct = {
		type: "text",
		text: tick.label,
		x: 0, y: 0,
		maxWidth: buildOpts.maxWidth,
		maxHeight: buildOpts.maxHeight
	};

	if ( buildOpts.align === "top" || buildOpts.align === "bottom" ) {
		struct.x = ( tick.position * buildOpts.innerRect.width ) + buildOpts.innerRect.x - buildOpts.outerRect.x;
		struct.y = buildOpts.align === "top" ? buildOpts.innerRect.height : 0;
		struct.anchor = "middle";
	} else {
		struct.y = ( ( tick.position ) * buildOpts.innerRect.height ) + buildOpts.innerRect.y - buildOpts.outerRect.y;
		struct.x = buildOpts.align === "left" ? buildOpts.innerRect.width : 0;
		struct.anchor = buildOpts.align === "left" ? "end" : "start";
	}

	let labelAdjustForEnds = () => {
		const outerBoundaryMultipler = 0.75;

		if ( buildOpts.align === "top" || buildOpts.align === "bottom" ) {
			const leftBoundary = 0;
			const rightBoundary = buildOpts.outerRect.width;
			const textWidth = Math.min( ( buildOpts.maxWidth * outerBoundaryMultipler ) / 2, buildOpts.textRect.width / 2 );
			const leftTextBoundary = struct.x - textWidth;
			const rightTextBoundary = struct.x + textWidth;
			if ( leftTextBoundary < leftBoundary ) {
				struct.anchor = "left";
				struct.x = buildOpts.innerRect.x - buildOpts.outerRect.x;
				struct.maxWidth = struct.maxWidth * outerBoundaryMultipler;
			} else if ( rightTextBoundary > rightBoundary ) {
				struct.anchor = "end";
				struct.x = buildOpts.innerRect.width + buildOpts.innerRect.x;
				struct.maxWidth = struct.maxWidth * outerBoundaryMultipler;
			}
		} else {
			const topBoundary = 0;
			const bottomBoundary = buildOpts.outerRect.height;
			const textHeight = buildOpts.maxHeight / 2;
			const topTextBoundary = struct.y - textHeight;
			const bottomTextBoundary = struct.y + textHeight;
			if ( topTextBoundary < topBoundary ) {
				struct.y = buildOpts.innerRect.y - buildOpts.outerRect.y;
				struct.baseline = "text-before-edge";
			} else if ( bottomTextBoundary > bottomBoundary ) {
				struct.baseline = "text-after-edge";
				struct.y = buildOpts.innerRect.height + buildOpts.innerRect.y - buildOpts.outerRect.y;
			} else {
				struct.baseline = "central";
			}
		}
	};

	let labelApplyPadding = () => {
		if ( buildOpts.align === "top" ) {
			struct.y -= buildOpts.padding;
		} else if ( buildOpts.align === "bottom" ) {
			struct.y += buildOpts.padding + buildOpts.maxHeight;
		} else if ( buildOpts.align === "left" ) {
			struct.x -= buildOpts.padding;
		} else if ( buildOpts.align === "right" ) {
			struct.x += buildOpts.padding;
		}
	};

	let labelApplyStyle = () => {
		extend( struct, buildOpts.style );
	};
	labelApplyStyle();
	labelAdjustForEnds();
	labelApplyPadding();
	return struct;
}

export function buildLine( buildOpts ) {
	const struct = {
		type: "line",
		x1: 0, x2: 0, y1: 0, y2: 0
	};

	if ( buildOpts.align === "top" || buildOpts.align === "bottom" ) {
		struct.x1 = buildOpts.innerRect.x - buildOpts.outerRect.x;
		struct.x2 = buildOpts.innerRect.width + buildOpts.innerRect.x;
		struct.y1 = struct.y2 = buildOpts.align === "top" ? buildOpts.innerRect.height : 0;
	} else {
		struct.x1 = struct.x2 = buildOpts.align === "left" ? buildOpts.innerRect.width : 0;
		struct.y1 = buildOpts.innerRect.y - buildOpts.outerRect.y;
		struct.y2 = buildOpts.innerRect.height + buildOpts.innerRect.y;
	}

	let lineApplyStyle = () => {
		extend( struct, buildOpts.style );
		const halfWidth = struct.strokeWidth / 2;

		if ( buildOpts.align === "top" ) {
			struct.y1 -= halfWidth;
			struct.y2 -= halfWidth;
		} else if ( buildOpts.align === "bottom" ) {
			struct.y1 += halfWidth;
			struct.y2 += halfWidth;
		} else if ( buildOpts.align === "left" ) {
			struct.x1 -= halfWidth;
			struct.x2 -= halfWidth;
		} else if ( buildOpts.align === "right" ) {
			struct.x1 += halfWidth;
			struct.x2 += halfWidth;
		}
	};

	lineApplyStyle();
	return struct;
}
