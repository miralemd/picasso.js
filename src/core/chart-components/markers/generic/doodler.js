import { default as extend } from "extend";

export function doodler() {
	function doodle() {
		doodle.push = v => v;
		doodle.settings = { styles: {} };
		doodle.customStyle = {};

		return doodle;
	}

	doodle.customize = function( item ) {
		if (
			doodle.settings.styler &&
			typeof doodle.settings.styler === "function"
		) {
			doodle.customStyle = doodle.settings.styler( item ) || {};
		}
	};

	doodle.style = function( object, styleName ) {
		return extend(
			object,
			doodle.settings.styles.base || {},
			doodle.settings.styles[styleName] || {},
			doodle.customStyle[styleName] || {}
		);
	};

	doodle.postfill = function( object, key, fill ) {
		doodle.settings.styles[object] = doodle.settings.styles[object] || {};
		doodle.settings.styles[object][key] = doodle.settings.styles[object][key] * fill || fill;
	};

	doodle.horizontalLine = function( x, y, width, styleName ) {
		return doodle.push(
			doodle.style( {
				type: "line",
				y1: y,
				x1: x - ( width / 2 ),
				y2: y,
				x2: x + ( width / 2 ),
				stroke: "#000",
				strokeWidth: 1
			},
			styleName )
		);
	};

	doodle.verticalLine = function( x, y1, y2, styleName ) {
		return doodle.push(
			doodle.style( {
				type: "line",
				y1: y1,
				x1: x,
				y2: y2,
				x2: x,
				stroke: "#000",
				strokeWidth: 1
			},
			styleName )
		);
	};

	doodle.whisker = function( x, y ) {
		let width = doodle.settings.styles.whisker.width;

		return doodle.push(
			doodle.style( {
				type: "line",
				y1: y,
				x1: x - ( width / 2 ),
				cx: x,
				cy: y,
				r: width / 2,
				y2: y,
				x2: x + ( width / 2 ),
				stroke: "#000",
				strokeWidth: 1
			},
			"whisker" )
		);
	};

	doodle.openwhisker = function( x, y ) {
		return doodle.whisker(
			x - ( doodle.settings.styles.whisker.width / 2 ),
			y
		);
	};

	doodle.closewhisker = function( x, y ) {
		return doodle.whisker(
			x + ( doodle.settings.styles.whisker.width / 2 ),
			y
		);
	};

	doodle.median = function( x, y ) {
		return doodle.horizontalLine(
			x,
			y,
			doodle.settings.styles.box.width,
			"med"
		);
	};

	doodle.box = function( x, y, height, name ) {
		return doodle.push(
			doodle.style( {
				type: "rect",
				x: x - ( doodle.settings.styles[name].width / 2 ),
				y: y,
				height: height,
				width: doodle.settings.styles[name].width,
				fill: "#fff",
				stroke: "#000"
			},
			name )
		);
	};

	return doodle();
}
