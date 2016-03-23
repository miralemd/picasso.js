export default {

	/**
	 *
	 * @param direction - top, bottom, left, right
	 * @param colors - Linear Scale or Array of colors
	 * @param percentage - Boolean.
     * @returns {string}
     */
	linearGradient( direction, colors, percentage ) {

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
	}
};


