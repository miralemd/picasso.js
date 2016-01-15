// import Linear from "../scales/linear";
 //import ticker from "../scales/ticks";

export default class Axis {
	constructor() {
		this.dock = "left";
		this.rect = {width: 0, height: 0, x: 0, y: 0};

		this.scale = undefined;// = null;new Linear( [0, 1], [0, 1], ticker );
		this.ticks = [];
	}

	calculateRelevantSize() {
		this.relevantSize = 100;
	}

	update() {
		this.ticks = !this.scale || !this.scale.ticker ? [] : this.scale.ticker.generateTicks( this.scale.domain[0], this.scale.domain[1], 6 ).map( v => {
			return {
				value: v,
				label: String( v ), // TODO - formatting options
				position: this.scale.get( v )
			};
		} );
	}
}
