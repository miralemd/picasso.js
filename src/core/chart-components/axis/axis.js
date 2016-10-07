import { nodeBuilder } from "./axis-node-builder";
import { discreteDefaultSettings, continuousDefaultSettings } from "./axis-default-settings";
import { generateContinuousTicks, generateDiscreteTicks } from "./axis-tick-generators";
import { default as extend } from "extend";

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

function alignTransform( { align, innerRect } ) {
	if ( align === "left" ) {
		return { x: innerRect.width, y: 0 };
	} else if ( align === "right" || align === "bottom" ) {
		return { x: 0, y: 0 };
	} else {
		return { x: 0, y: innerRect.height };
	}
}

function qDiscreteDataMapper( data, source ) {
	return data.fromSource( source, 0 ).map( ( d ) => {
		return d.qText;
	} );
}

export function abstractAxis( axisConfig, composer, renderer ){
	const innerRect = { width: 0, height: 0, x: 0, y: 0 };
	const outerRect = { width: 0, height: 0, x: 0, y: 0 };
	const nodes = [];
	const scale = composer.scales[axisConfig.scale].scale;
	const type = composer.scales[axisConfig.scale].type;
	const source = composer.scales[axisConfig.scale].source;
	let data = composer.data;
	let concreteNodeBuilder;
	let settings;
	let ticksFn;

	let continuous = function() {
		settings = continuousDefaultSettings();
		extend( true, settings, axisConfig.settings );
		extendDomain( settings, scale );
		continuous.resize( renderer.size() );
		continuous.resize( alignTransform( { align: settings.align, innerRect } ) );
		concreteNodeBuilder = nodeBuilder( type );
		ticksFn = generateContinuousTicks;

		return continuous;
	};

	let discrete = function( dataMapper = qDiscreteDataMapper ) {
		settings = discreteDefaultSettings();
		extend( true, settings, axisConfig.settings );
		discrete.resize( renderer.size() );
		discrete.resize( alignTransform( { align: settings.align, innerRect } ) );
		concreteNodeBuilder = nodeBuilder( type );
		ticksFn = generateDiscreteTicks;
		data = dataMapper( data, source );
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
		outer = outer ? outer : inner;
		extend( innerRect, inner );
		extend( outerRect, outer );
	};

	// Declare public API
	continuous.render = render;
	continuous.onData = onData;
	continuous.resize = resize;
	discrete.render = render;
	discrete.onData = onData;
	discrete.resize = resize;

	return type === "ordinal" ? discrete : continuous;
}

export function axis( ...a ) {
	let ax = abstractAxis( ...a );
	ax().render();
	return ax;
}
