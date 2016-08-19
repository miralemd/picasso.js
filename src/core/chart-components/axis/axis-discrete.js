import { Axis } from "./axis";
import { AxisHelpers as helpers } from "./axis-helpers";

export default class AxisDiscrete extends Axis {
	constructor( config, composer, renderer ) {
		super( config, composer, renderer );
		this._ticks = [];
	}

	settings( opt ) {
		this._settings = {
			direction: "ltl",
			title: {
				value: "Fake title asdaadasd asda das das das das dasd as dasdasdasd",
				show: true,
				style: {
					font: "Arial",
					size: 15,
					color: "#999"
				},
				padding: 15
			},
			labels: {
				show: true,
				tilted: false,
				style: {
					font: "Arial",
					size: 13,
					color: "#999"
				},
				padding: 4
			},
			line: {
				show: true,
				style: {
					size: 1,
					color: "#999"
				}
			},
			ticks: {
				show: true,
				padding: 0,
				style: {
					size: 4, // TODO unify format for size
					color: "#999",
					thickness: 1
				}
			}
		};
		helpers.applyData( this._settings, opt );
		return this;
	}

	onData() {
		this._ticks = this.scale.domain().map( ( d, i ) => {
			return {
				position: this.scale.get( d, i ),
				label: this.data.fromSource( this.source, 0 )[i].qText
			};
		} );

		return this;
	}

	render( ) {
		this.onData();
		this.generateLine();
		this.generateTicks();
		this.generateLabels();
		this.generateTitle();

		this.renderer.render( this.elements );
	}
}

export function axisDiscrete( ...a ) {
	return new AxisDiscrete( ...a );
}
