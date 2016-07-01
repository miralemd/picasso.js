export default class AxisDiscrete {
	constructor( scale ) {
		this.scale = scale;
		this.orientation = "vertical";
		this.rect = { width: 0, height: 0, x: 0, y: 0 };
		this._ticks = [];
		this.isDiscrete = !Number.isInteger( this.scale.domain()[0] );

		// TODO Range must be continuous and numeric?
	}

	ticks() {
		return this.scale.domain().map( ( d, i ) => {
			return {
				start: 0,
				end: 1,
				position: this.scale.get( d ),
				label: d,
				index: i
			};
		} );
	}

	domain() {
		const rect = { width: 0, height: 0, x: 0, y: 0 };
		if ( this.isVertical ) {
			rect.height = this.rect.height;
			rect.width = 1;
		} else {
			rect.width = this.rect.width;
			rect.height = 1;
		}
		return rect;
	}
}

export function axisDiscrete( ...a ) {
	return new AxisDiscrete( ...a );
}
