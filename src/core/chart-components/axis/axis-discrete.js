import { Axis } from "./axis";
import { AxisHelpers as helpers } from "./axis-helpers";
import { default as svgText } from "../../../web/renderer/svg-renderer/svg-text-helpers";
import { AxisStructs } from "./axis-structs";

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
				padding: 4,
				layered: true
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

	generateLabels() {
		this._settings.labels.dock = this._dock;
		this._settings.labels.direction = this._settings.direction;
		this._settings.labels.spacing = helpers.labelsSpacing( this._settings );
		this._settings.labels.bandWidth = helpers.labelsBandwidth( this._dock, this._settings.labels, this._ticks, this.rect );

		const ellipsOpt = {
			width: this._settings.labels.bandWidth.width,
			text: "",
			fontSize: this._settings.labels.style.size,
			font: this._settings.labels.style.font
		};

		if ( this._settings.labels.layered && this._settings.labels.bandWidth.width < ( this.rect.width / 15 ) && ( this._dock === "top" || this._dock === "bottom" ) ) {
			this._ticks.forEach( ( tick, i ) => {
				const struct = { type: "text", text: tick.label, x: 0, y: 0, "font-family": this._settings.labels.style.font,	"font-size": this._settings.labels.style.size, fill: "white" };
				this._settings.labels.spacing = i % 2 === 0 ? helpers.labelsSpacing( this._settings ) : helpers.labelsSpacing( this._settings ) + svgText.getComputedRect( struct ).height;

				if ( this._settings.labels.show && !tick.isMinor ) {
					ellipsOpt.text = tick.label;
					ellipsOpt.width = this._settings.labels.bandWidth.width * 2;
					tick.label = svgText.ellipsis( ellipsOpt );
					this.elements.push( AxisStructs.label( tick, this._settings.labels, this.rect, this.renderer.rect ) );
				}
			} );
		} else {
			this._ticks.forEach( ( tick ) => {
				if ( this._settings.labels.show && !tick.isMinor ) {
					ellipsOpt.text = tick.label;
					tick.label = svgText.ellipsis( ellipsOpt );
					this.elements.push( AxisStructs.label( tick, this._settings.labels, this.rect, this.renderer.rect ) );
				}
			} );
		}
	}
}

export function axisDiscrete( ...a ) {
	return new AxisDiscrete( ...a );
}
