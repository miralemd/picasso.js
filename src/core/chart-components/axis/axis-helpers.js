import { default as svgText } from "../../../web/renderer/svg-renderer/svg-text-helpers";

export class AxisHelpers {
	static tickSpacing( settings ) {
		return settings.line.style.size + settings.ticks.padding;
	}

	static tickMinorSpacing( settings ) {
		return settings.line.style.size + settings.minorTicks.padding;
	}

	static labelsSpacing( settings ) {
		let spacing = 0;
		spacing += settings.ticks.show ? settings.ticks.style.size : 0;
		spacing += AxisHelpers.tickSpacing( settings ) + settings.labels.padding;
		return spacing;
	}

	static titleSpacing( settings, ticks, dock ) {
		let spacing = 0;
		spacing += settings.labels.show ? AxisHelpers.labelsSpacing( settings ) + settings.title.padding : settings.title.padding;
		if ( dock === "bottom" ) {
			spacing += settings.labels.style.size * 2;
		} else if ( dock === "top" ){
			spacing += settings.labels.style.size;
		} else {
			const maxTextLength = Math.max.apply( this, ticks.map( ( t ) => svgText.getComputedTextLength( t.label, settings.labels.style.size, settings.labels.style.font ) ) );
			spacing += maxTextLength;
		}
		return spacing;
	}

	static labelsBandwidth( dock, settings, ticks, rect ) {
		const innerPadding = 0.75;
		const bandWidth = { width: 0, height: 0 };
		ticks = ticks.filter( ( t ) => !t.isMinor );

		bandWidth.height = ( rect.height / ticks.length ) * innerPadding;
		if ( dock === "left" || dock === "right" ) {
			bandWidth.width = ( rect.width - settings.spacing ) * innerPadding;
		} else {
			bandWidth.width = ( rect.width / ticks.length ) * innerPadding;
		}

		return bandWidth;
	}

	static applyData( target, data ) {
		for ( let d in data ) {
			if ( data.hasOwnProperty( d ) ) {
				if ( typeof data[d] === "object" && !Array.isArray( data[d] ) ) {
					target[d] = AxisHelpers.applyData( target[d], data[d] );
				} else {
					target[d] = data[d];
				}
			}
		}
		return target;
	}
}
