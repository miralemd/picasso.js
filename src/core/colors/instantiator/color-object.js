import RgbaColor from "../rgba-color";
import HslaColor from "../hsla-color";

export default function colorObject( colorObj ) {
	let colorType = colorObject.getColorType( colorObj );

	switch ( colorType ) {
		case "rgb":
			return new RgbaColor( colorObj.r, colorObj.g, colorObj.b, colorObj.a );
		case "hsl":
			return new HslaColor( colorObj.h, colorObj.s, colorObj.l, colorObj.a );
		default:
			return undefined;
	}
}

colorObject.test = ( obj ) => {
	if( obj === null || obj === undefined || typeof obj !== "object" ) {
		return false;
	} else {
    // Doesnt really work out well if any of the proparties have invalid values
		return colorObject.getColorType( obj ) !== undefined;
	}
};

colorObject.getColorType = ( obj ) => {
	if ( typeof obj === "object" && obj.hasOwnProperty("r") && obj.hasOwnProperty("g") && obj.hasOwnProperty("b") ) {
		return "rgb";
	} else if ( typeof obj === "object" && obj.hasOwnProperty("h") && obj.hasOwnProperty("s") && obj.hasOwnProperty("l") ) {
		return "hsl";
	}
	return undefined;
};
