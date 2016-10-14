import { renderer } from "../../../renderer";
import { shape as shapeFactory } from "./shapes";

const SETTINGS = {
	shape: "circle",
	label: "",
	fill: "#999",
	stroke: "#ccc",
	strokeWidth: 0,
	opacity: 1,
	x: 0.5,
	y: 0.5,
	size: 1
};

function values( table, setting ) {
	if ( setting && setting.source ) {
		return table.findField( setting.source ).values();
	}
	return null;
}

function prop( stngs, name, composer ) {
	const type = typeof stngs[name];

	if ( type === "undefined" ) {
		return SETTINGS[name];
	}
	if ( type === typeof SETTINGS[name] ) { // if property is of same primitive type as default, use the provided value
		return stngs[name];
	}
	if ( type === "function" ) { // custom accessor function
		return stngs[name];
	}
	if ( typeof stngs[name].fn === "function" ) { // custom accessor function inside object
		return stngs[name].fn;
	}
	const scale = composer.scale( stngs[name] ); // check if a scale accessor can be created from the given input

	return scale || SETTINGS[name];
}

function calculateLocalSettings( stngs, composer ) {
	let ret = {};
	for ( let s in SETTINGS ) {
		ret[s] = prop( stngs, s, composer );
	}
	return ret;
}

export default class Point {
	constructor( obj, composer ) {
		this.container = composer.container();

		this.renderer = renderer();
		this.renderer.appendTo( this.container );

		this.settings = obj.settings;
		this.table = composer.table();
		this.obj = obj;
		this.composer = composer;

		this.rect = { x: 0, y: 0, width: 0, height: 0 };

		this.onData();
	}

	onData() {
		this.points = [];

		const data = values( this.table, this.obj.data );
		const local = calculateLocalSettings( this.settings, this.composer );
		const dataValues = {};

		for ( let s in SETTINGS ) {
			dataValues[s] = values( this.table, this.settings[s] ) || data;
		}

		this.points = data.map( ( p, i ) => {
			const obj = {};
			for ( let s in SETTINGS ) {
				obj[s] = typeof local[s] === "function" ? local[s]( dataValues[s][i], i, dataValues[s] ) : local[s];
			}
			return obj;
		} );
	}

	render() {
		const points = this.points;
		const numYValues = this.y && this.y.type === "ordinal" ? this.y.scale.domain().length : -1;
		const { x, y, width, height } = this.rect;
		const pointSize = numYValues === -1 ? [10, 40] : [Math.max( 1, Math.min( 5, 1 * height / numYValues ) ), Math.max( 1, Math.min( 40, 1 * height / numYValues ) ) ];
			//numXValues = this.x && this.x.type === "ordinal" ? this.x.scale.domain().length : -1,
		const displayPoints = points.filter( p => {
			return !isNaN( p.x + p.y + p.size );
		} ).map( p => {
			return shapeFactory( p.shape, {
				label: p.label,
				x: p.x * width + x,
				y: ( 1 - p.y ) * height + y,
				fill: p.fill,
				size: pointSize[0] + p.size * ( pointSize[1] - pointSize[0] ), // TODO - replace with scale
				stroke: p.stroke,
				strokeWidth: p.strokeWidth,
				opacity: p.opacity
			} );
		} );

		this.renderer.render( displayPoints );
	}

	resize( rect ) {
		this.rect = rect;
	}
}

export function point( obj, composer ) {
	return new Point( obj, composer );
}
