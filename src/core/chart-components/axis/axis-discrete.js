import { Axis } from "./axis";
import { AxisHelpers as helpers } from "./axis-helpers";
import { default as svgText } from "../../../web/renderer/svg-renderer/svg-text-helpers";
import { AxisStructs } from "./axis-structs";

export default class AxisDiscrete extends Axis {
	constructor( axisConfig, composer, renderer ) {
		super( axisConfig, composer, renderer );
		this._ticks = [];
		this.settings( axisConfig.settings );
		this.render();
	}

	settings( opt ) {
		this._settings = {
			labels: {
				show: true,
				tilted: false,
				style: {
					font: "Arial",
					size: 13,
					color: "#999"
				},
				padding: 6,
				layered: true // TODO support auto, true and false?
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
		// TODO Handle data paging
		this._ticks = this.data.fromSource( this.source, 0 ).map( ( d, i ) => {
			return {
				position: this.scale.get( i ),
				label: d.qText
			};
		} );

		return this;
	}

	render() {
		this.onData();

		if ( this._settings.line.show ) {
			this.elements.push( this.generateLine() );
		}
		if ( this._settings.ticks.show ) {
			this.generateTicks().forEach( ( tick ) => { this.elements.push( tick ); } );
		}
		if ( this._settings.labels.show ) {
			this.generateLabels().forEach( ( label ) => { this.elements.push( label ); } );
		}

		this.renderer.render( this.elements );

		return this;
	}

	generateLabels() {
		this._settings.labels.dock = this._dock;
		this._settings.labels.spacing = helpers.labelsSpacing( this._settings );
		this._settings.labels.bandWidth = helpers.labelsBandwidth( this._dock, this._settings.labels, this._ticks, this.rect );

		const ellipsOpt = {
			width: this._settings.labels.bandWidth.width,
			text: "",
			fontSize: this._settings.labels.style.size,
			font: this._settings.labels.style.font
		};

		if ( this._settings.labels.layered && ( this._dock === "top" || this._dock === "bottom" ) ) {
			return this._ticks.filter( ( t ) => { return !t.isMinor; } ).map( ( tick, i ) => {
				const struct = { type: "text", text: tick.label, x: 0, y: 0, "font-family": this._settings.labels.style.font,	"font-size": this._settings.labels.style.size, fill: "white" };
				this._settings.labels.spacing = i % 2 === 0 ? helpers.labelsSpacing( this._settings ) : helpers.labelsSpacing( this._settings ) + svgText.getComputedRect( struct ).height + this._settings.labels.padding;
				ellipsOpt.text = tick.label;
				ellipsOpt.width = this._settings.labels.bandWidth.width * 2;
				tick.label = svgText.ellipsis( ellipsOpt );
				return AxisStructs.label( tick, this._settings.labels, this.rect, this.renderer.rect );
			} );
		} else {
			return this._ticks.filter( ( t ) => { return !t.isMinor; } ).map( ( tick ) => {
				ellipsOpt.text = tick.label;
				tick.label = svgText.ellipsis( ellipsOpt );
				return AxisStructs.label( tick, this._settings.labels, this.rect, this.renderer.rect );
			} );
		}
	}
}

export function axisDiscrete( ...a ) {
	return new AxisDiscrete( ...a );
}
