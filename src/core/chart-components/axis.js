import Events from "../utils/event-emitter";

export default class Axis {
	constructor() {
		this.dock = "left";
		this.rect = {width: 0, height: 0, x: 0, y: 0};

		this.scale = undefined;
		this.ticks = [];
		this.labels = [];
	}

	calculateRelevantSize() {
		this.relevantSize = 100;
	}

	data( ) {}

	update( ) {
		this.isVertical = ["left", "right"].indexOf( this.dock ) !== -1 ? true : false;

		this.ticks = [];
		this.labels = [];
		if ( this.scale ) {
			this.scale.nTicks = Math.max( 2, Math.round( this.rect.height / 48 ) );
			this.scale.update();

			if ( this.scale.isDiscrete ) {
				//let unitSize = this.scale.getUnitSize();
				this.labels = !this.scale.levels || !this.scale.levels.length ? [] : this.scale.levels.map( ( level, idx ) => level.map( ( a, i ) => {
					let range = this.scale.getRange( i, idx );
					return {
						label: a.name,
						position: 0.5 * ( range.end - range.start ),
						start: range.start,
						end: range.end
					};
				} ) );
			} else {
				this.ticks.push( [] );
				this.labels.push( [] );
				this.scale.ticks.map( v => {
					this.ticks[0].push( {
						value: v,
						label: String( v ), // TODO - formatting options
						position: this.scale.get( v )
					} );

					this.labels[0].push( {
						value: v,
						label: String( v ), // TODO - formatting options
						position: this.scale.get( v )
					} );
				} );
			}
		}

		this.emit( "changed" );
	}
}

Events.mixin( Axis.prototype );

export function axis( ...a ) {
	return new Axis( ...a );
}
