import Linear from "../../scales/linear";
import Nominal from "../../scales/nominal";
import ticker from "../../scales/ticks";
import DockLayout from "../../chart-components/dock-layout";
import BarArea from "../../chart-components/bar-area";
import Axis from "../../chart-components/axis";
import dataMatrix from "../../data/data-matrix";

export default class BarChart {
	constructor() {
		this.rect = { x: 0, y: 0, width: 0, height: 0 };

		this.layoutEngine = new DockLayout();

		this.measureAxis = new Axis();
		this.dimensionAxis = new Axis();
		this.barArea = new BarArea();

		this.measureScale = new Linear( [0, 1], [0, 1], ticker );
		this.dimensionScale = new Nominal();

		this.measureAxis.scale = this.barArea.measureScale = this.measureScale;
		this.dimensionAxis.scale = this.barArea.dimensionScale = this.dimensionScale;

		this.dimensionAxis.dock = "bottom";

		this.components = [this.measureAxis, this.dimensionAxis, this.barArea];

		this.layoutEngine.addComponent( this.dimensionAxis );
		this.layoutEngine.addComponent( this.measureAxis );
		this.layoutEngine.addComponent( this.barArea );
	}

	data( data/*, options = {} */ ) {
		let meta = dataMatrix.getColumnMetaData( data ),
			min = Math.min.apply( null, [0].concat( meta.filter( c => c.type === "numeric" ).map( c => c.min ) ) ),
			max = Math.max.apply( null, [0].concat( meta.filter( c => c.type === "numeric" ).map( c => c.max ) ) );

		this.measureScale.from( [min, max] );
		this.barArea.data( data );
	}

	resize( ) {
		this.update();
	}

	update() {
		this.layoutEngine.layout( this.rect );
		this.components.forEach( c => {
			c.update();
		} );
	}
}

export function barChart() {
	return new BarChart();
}
