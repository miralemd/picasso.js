import { registry } from "../../utils/registry";
import { components } from "../../chart-components/index";
import { data } from "../../data/index";
import { dockLayout } from "../../dock-layout/dock-layout";
import {
	default as buildFormatters,
	getOrCreateFormatter
} from "./formatter/index";
import {
	builder as buildScales,
	getOrCreateScale
} from "./scales";

const regComps = registry();
regComps.add( "components", components );

const regPreComps = registry();
regPreComps.add( "scales", buildScales );
regPreComps.add( "formatters", buildFormatters );


function getRect( container ) {
	let rect = { x: 0, y: 0, width: 0, height: 0 };
	if ( typeof container.getBoundingClientRect === "function" ) {
		let boundingRect = container.getBoundingClientRect();
		rect.width = boundingRect.width;
		rect.height = boundingRect.height;
	} else if ( container.hasOwnProperty( "height" ) && container.hasOwnProperty( "width" ) ) {
		rect.width = container.width;
		rect.height = container.height;
	}

	return rect;
}

function flattenComponents( c ) {
	let chartComponents = [];
	for ( let prop in c ) {
		if ( c.hasOwnProperty( prop ) ) {
			if ( Array.isArray( c[prop] ) ) {
				c[prop].forEach( cc => chartComponents.push( cc ) );
			} else {
				c.push( c[prop] );
			}
		}
	}
	return chartComponents;
}

export function composer () {

	let scales = {},
		formatters = {},
		tables = [],
		comps = {},
		container = null,
		docker = dockLayout();

	let fn = function() {};

	fn.build = function( element, meta, settings ) {
		container = element;
		fn.data( meta, settings );
		fn.render();
	};

	fn.data = function( meta, settings ) {
		tables = [data( meta )];
		let preComps = regPreComps.build( settings, fn );
		scales = preComps.scales;
		formatters = preComps.formatters;
		comps = regComps.build( settings, fn ).components;
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

	fn.render = function() {
		let cRect = getRect( container );
		let cc = flattenComponents( comps );

		cc.forEach( ( c ) => { docker.addComponent( c ); } );

		docker.layout( cRect );

		cc.forEach( ( c ) => { c.render(); } );
	};

	fn.formatter = function ( v ) {
		return getOrCreateFormatter( v, formatters, fn.table() );
	};

	return fn;
}
