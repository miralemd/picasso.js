import Color from "./color";

/**
 * Returns the contrast ratio between two colors.
 * According to the Web Content Accessibility Guidelines the contrast between background and small text should be at least 4.5 : 1.
 * @param c1 - Color
 * @param c2 - Color
 * @return {number} - contrast ratio between two colors.
 */
export const getContrast = ( c1, c2 ) => {

	c1 = new Color( c1 );
	c2 = new Color( c2 );

	let l1 = c1.getLuminance(),
		l2 = c2.getLuminance();

	if (l1 > l2) {
		return (l1 + 0.05) / (l2 + 0.05);
	} else {
		return (l2 + 0.05) / (l1 + 0.05);
	}
};

/**
 * Returns one of two colors with the highest contrast to the current color
 * @param c - Color
 * @param c1 - Color
 * @param c2 - Color
 * @returns {color}
 */
export const getMostContrastColor = ( c, c1, c2 ) => {

	c = new Color(c);
	c1 = new Color( c1 );
	c2 = new Color( c2 );

	return getContrast( c, c1 ) > getContrast( c, c2 ) ? c1 : c2;
};

/**
 * Checks if this color is perceived as dark.
 * @return {boolean} True if the luminance is below 125, false otherwise.
 */
export const isDark = ( c ) => {
	c = new Color( c );
	return c.getLuminance() < 0.49;
};
