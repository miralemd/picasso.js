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
			const maxComputedLength = ticks.map( ( t ) => svgText.getComputedTextLength( t.label, settings.labels.style.size, settings.labels.style.font ) );
			spacing += maxComputedLength.length > 0 ? Math.max.apply( this, maxComputedLength ) : 0;
		}
		return spacing;
	}

	static labelsBandwidth( dock, settings, ticks, rect ) {
		let innerPadding = 1;
		const bandWidth = { width: 0, height: 0 };
		ticks = ticks.filter( ( t ) => !t.isMinor );

		bandWidth.height = ( rect.height / ticks.length ) * innerPadding;
		if ( dock === "left" || dock === "right" ) {
			bandWidth.width = ( rect.width - settings.spacing ) * innerPadding;
		} else {
			innerPadding = 0.75;
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
