import color from "./color";

export default {

	/**
	 *
	 * @param direction - top, bottom, left, right
	 * @param colors - Linear Scale or Array of colors
	 * @param percentage - Boolean.
     * @returns {string}
     */
	linearGradient: ( direction, colors, percentage ) => {

		let cssColors;

		if ( typeof colors === "object" && colors.hasOwnProperty( "inputDomain" ) ) {
				let inputDomain = colors.inputDomain;

				cssColors = inputDomain.map( ( d ) => {
					return colors.get( d );
				} ).join();
		}

		else if ( colors.constructor === Array ) {
			cssColors = colors;
		}

		if ( percentage ) {

			let result = "",
				interval = 100 / colors.length,
				percent = 0;

			for ( let i = 0; i < cssColors.length; i++ ) {
				result += `${cssColors[i]} ${percent}%, ${cssColors[i]} ${percent + interval}%, `;
				percent = percent + interval;
			}

			cssColors = result.slice( 0, -2 );
		}

		return `linear-gradient(to ${direction}, ${cssColors})`;
	},

	/**
	 * Returns the contrast ratio between two colors.
	 * According to the Web Content Accessibility Guidelines the contrast between background and small text should be at least 4.5 : 1.
	 * @param c1 - Color
	 * @param c2 - Color
	 * @return {number} - contrast ratio between two colors.
	 */
	getContrast: ( c1, c2 ) => {

		c1 = color( c1 );
		c2 = color( c2 );

		let l1 = c1.getLuminance(),
			l2 = c2.getLuminance();

		if ( l1 > l2 ) {
			return ( l1 + 0.05 ) / ( l2 + 0.05 );
		} else {
			return ( l2 + 0.05 ) / ( l1 + 0.05 );
		}
	}
};
