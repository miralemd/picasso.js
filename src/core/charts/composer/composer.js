import { registry } from "../../utils/registry";
import { components } from "../../chart-components/index";
import { scale } from "./scales";
import { data } from "../../data/index";

let regComps = registry();
regComps.register( "components", components );

let regScales = registry();
regScales.register( "scales", scale );

export default class Composer {
	build( element, meta, settings ) {
		this.element = element;

		this.data = null;
		this.scales = null;
		this.components = null;

		this.onMeta( meta, settings );
	}

	onMeta( meta, settings ) {
		this.data = data( meta );
		this.scales = regScales.build( settings, this ).scales;
		this.components = regComps.build( settings, this );
	}
}

export function composer() {
	return new Composer();
}
