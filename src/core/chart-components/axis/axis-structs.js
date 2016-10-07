import { default as extend } from "extend";

export function buildTick( tick, buildOpts ) {
	const struct = {
		type: "line",
		x1: 0, x2: 0, y1: 0, y2: 0
	};

	if ( buildOpts.align === "top" || buildOpts.align === "bottom" ) {
		struct.x1 = tick.position * buildOpts.innerRect.width;
		struct.x2 = tick.position * buildOpts.innerRect.width;
		struct.y1 = buildOpts.align === "top" ? buildOpts.innerRect.y : 0;
		struct.y2 = buildOpts.align === "top" ? struct.y1 - buildOpts.tickSize : struct.y1 + buildOpts.tickSize;
	} else {
		struct.y1 = ( 1 - tick.position ) * buildOpts.innerRect.height;
		struct.y2 = ( 1 - tick.position ) * buildOpts.innerRect.height;
		struct.x1 = buildOpts.align === "left" ? buildOpts.innerRect.x : 0;
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
		struct.x = ( tick.position * buildOpts.innerRect.width );
		struct.y = buildOpts.align === "top" ? buildOpts.innerRect.y : 0;
		struct.anchor = "middle";
	} else {
		struct.y = ( ( 1 - tick.position ) * buildOpts.innerRect.height );
		struct.x = buildOpts.align === "left" ? buildOpts.innerRect.x : 0;
		struct.anchor = buildOpts.align === "left" ? "end" : "start";
	}

	let labelAdjustForEnds = () => {
		const outerBoundryMultipler = 0.75;

		if ( buildOpts.align === "top" || buildOpts.align === "bottom" ) {
			if ( ( struct.x + buildOpts.innerRect.x ) <= Math.min( buildOpts.maxWidth * outerBoundryMultipler, buildOpts.textRect.width / 2 ) ) {
				struct.anchor = "left";
				struct.x = buildOpts.innerRect.x;
				struct.maxWidth = struct.maxWidth * outerBoundryMultipler;
			} else if ( struct.x >= buildOpts.outerRect.width - buildOpts.innerRect.x - Math.min( buildOpts.maxWidth * outerBoundryMultipler, buildOpts.textRect.width / 2 ) ) {
				struct.anchor = "end";
				struct.x = buildOpts.innerRect.width;
				struct.maxWidth = struct.maxWidth * outerBoundryMultipler;
			}
		} else {
			if ( struct.y + buildOpts.innerRect.y <= buildOpts.maxHeight / 2 ) {
				struct.y = buildOpts.innerRect.y;
				struct.baseline = "text-before-edge";
			} else if ( struct.y + ( buildOpts.maxHeight / 2 ) > buildOpts.outerRect.height - buildOpts.innerRect.y ) {
				struct.baseline = "text-after-edge";
				struct.y = buildOpts.innerRect.height;
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
		struct.x2 = buildOpts.innerRect.width;
		struct.y1 = struct.y2 = buildOpts.align === "top" ? buildOpts.innerRect.y : 0;
	} else {
		struct.x1 = struct.x2 = buildOpts.align === "left" ? buildOpts.innerRect.x : 0;
		struct.y2 = buildOpts.innerRect.height;
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
