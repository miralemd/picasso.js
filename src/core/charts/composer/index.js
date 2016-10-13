import { registry } from "../../utils/registry";
import { components } from "../../chart-components/index";
import { data } from "../../data/index";
import {
	builder as buildScales,
	getOrCreateScale
} from "./scales";

const reg = registry();
reg.add( "components", components );
reg.add( "scales", buildScales );

export function composer () {

	let scales = {},
		tables = [],
		comps = {},
		container = null;

	let fn = function() {};

	fn.build = function( element, meta, settings ) {
		container = element;
		fn.data( meta, settings );
	};

	fn.data = function( meta, settings ) {
		tables = [data( meta )];
		let obj = reg.build( settings, fn );
		scales = obj.scales;
		comps = obj.components;
	};

	fn.table = function() {
		return tables[0];
	};

	fn.container = function() {
		return container;
	};

	fn.scale = function( v ) {
		return getOrCreateScale( v, scales, tables );
	};

	fn.components = function() {
		return comps;
	};

	return fn;
}
