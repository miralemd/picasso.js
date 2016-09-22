import { default as extend } from "extend";

export default class Doodler {
	constructor() {
		this.push = v => v;
		this.settings = { styles: {} };
		this.customStyle = {};
	}

	customize( item ) {
		if (
			this.settings.styler &&
			this.settings.styler instanceof Function
		) {
			this.customStyle = this.settings.styler( item ) || {};
		}
	}

	style( object, styleName ) {
		return extend(
			object,
			this.settings.styles.base || {},
			this.settings.styles[styleName] || {},
			this.customStyle[styleName] || {}
		);
	}

	postfill( object, key, fill ) {
		this.settings.styles[object] = this.settings.styles[object] || {};
		this.settings.styles[object][key] = this.settings.styles[object][key] || fill;
	}

	horizontalLine( x, y, width, styleName ) {
		return this.push(
			this.style( {
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
	}

	verticalLine( x, y1, y2, styleName ) {
		return this.push(
			this.style( {
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
	}

	whisker( x, y ) {
		return this.horizontalLine(
			x,
			y,
			this.settings.styles.whisker.width,
			"whisker"
		);
	}

	openwhisker( x, y ) {
		return this.whisker(
			x - ( this.settings.styles.whisker.width / 2 ),
			y
		);
	}

	closewhisker( x, y ) {
		return this.whisker(
			x + ( this.settings.styles.whisker.width / 2 ),
			y
		);
	}

	median( x, y ) {
		return this.horizontalLine(
			x,
			y,
			this.settings.styles.box.width,
			"med"
		);
	}

	box( x, y, height, name ) {
		return this.push(
			this.style( {
				type: "rect",
				x: x - ( this.settings.styles.box.width / 2 ),
				y: y,
				height: height,
				width: this.settings.styles.box.width,
				fill: "#fff",
				stroke: "#000"
			},
			name )
		);
	}
}

export function doodler( ...args ) {
	return new Doodler( ...args );
}
