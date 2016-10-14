import { nodeBuilder } from "./axis-node-builder";
import { discreteDefaultSettings, continuousDefaultSettings } from "./axis-default-settings";
import { generateContinuousTicks, generateDiscreteTicks } from "./axis-tick-generators";
import { default as extend } from "extend";
import { dockConfig } from "../../dock-layout/dock-config";

function extendDomain( settings, scale ) {
	const min = settings.ticks.min,
		max = settings.ticks.max,
		minSafe = min !== undefined,
		maxSafe = max !== undefined;

	if ( minSafe || maxSafe ) {
		const start = scale.start();
		const end = scale.end();
		const d = [ minSafe ? min : start, maxSafe ? max : end ];
		scale.domain( d );
	}
}

function alignTransform( { align, inner } ) {
	if ( align === "left" ) {
		return { x: inner.width + inner.x };
	} else if ( align === "right" || align === "bottom" ) {
		return inner;
	} else {
		return { y: inner.y + inner.height };
	}
}

function calcRequiredSize( dock ) {
	// TODO base it on something...
	let fn = function( rect ) {
		return dock === "top" || dock === "bottom" ? rect.height * 0.1 : rect.width * 0.1;
	};

	return fn;
}

function dockAlignSetup( settings, type ) {
	if ( settings.dock && !settings.align ) {
		settings.align = settings.dock;
	} else if ( !settings.dock && !settings.align ) {
		settings.align = type === "ordinal" ? "bottom" : "left";
	}
}

export function abstractAxis( axisConfig, composer, renderer ){
	const innerRect = { width: 0, height: 0, x: 0, y: 0 };
	const outerRect = { width: 0, height: 0, x: 0, y: 0 };
	const nodes = [];
	const dataScale = composer.scale( axisConfig );
	const scale = dataScale.scale;
	const type = dataScale.type;
	let data;
	let concreteNodeBuilder;
	let settings;
	let ticksFn;
	let layoutConfig = dockConfig();

	let init = function() {
		extend( true, settings, axisConfig.settings );
		concreteNodeBuilder = nodeBuilder( type );
		dockAlignSetup( settings, type );
		layoutConfig.dock( settings.dock );
		layoutConfig.requiredSize( calcRequiredSize( settings.dock ) );
	};

	let continuous = function() {
		settings = continuousDefaultSettings();
		ticksFn = generateContinuousTicks;
		init();
		extendDomain( settings, scale );

		return continuous;
	};

	let discrete = function() {
		settings = discreteDefaultSettings();
		ticksFn = generateDiscreteTicks;
		data = scale.domain();
		init();

		return discrete;
	};

	let render = function() {
		const ticks = ticksFn( { settings, innerRect, scale, data } );

		nodes.push( ...concreteNodeBuilder.build( { settings, scale, innerRect, outerRect, renderer, ticks } ) );
		renderer.render( nodes );
	};

	let onData = function() {
		// Do something
	};

	let resize = function( inner, outer ) {
		extend( inner, alignTransform( { align: settings.align, inner } ) );
		outer = outer ? outer : inner;
		extend( innerRect, inner );
		extend( outerRect, outer );
	};

	// Declare public API
	continuous.render = render;
	continuous.onData = onData;
	continuous.resize = resize;
	continuous.dockConfig = layoutConfig;

	discrete.render = render;
	discrete.onData = onData;
	discrete.resize = resize;
	discrete.dockConfig = layoutConfig;

	return type === "ordinal" ? discrete : continuous;
}

export function axis( ...a ) {
	let ax = abstractAxis( ...a );
	return ax();
}
