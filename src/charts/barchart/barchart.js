import Linear from "../../scales/linear";
import ticker from "../../scales/ticks";
import LayoutEngine from "../../chart-components/layout-engine";
import BarArea from "../../chart-components/bararea";
import Axis from "../../chart-components/axis";
import dataMatrix from "../../data/data-matrix";

export default class BarChart {
	constructor() {
		this.rect = {x: 0, y: 0, width: 0, height: 0};

		this.layoutEngine = new LayoutEngine();

		this.measureAxis = new Axis();
		this.barArea = new BarArea();

		this.scale = new Linear( [0, 1], [0, 1], ticker );
		this.measureAxis.scale = this.barArea.measureScale = this.scale;

		this.components = [this.measureAxis, this.barArea];

		this.layoutEngine.addComponent( this.measureAxis );
		this.layoutEngine.addComponent( this.barArea );
	}

	update( data, options = {} ) {
		let meta = dataMatrix.getColumnMetaData( data ),
			min = Math.min.apply( null, [0].concat( meta.filter( c => c.type === "numeric" ).map( c => c.min ) ) ),
			max = Math.max.apply( null, [0].concat( meta.filter( c => c.type === "numeric" ).map( c => c.max ) ) );

		this.scale.from( [min, max] );
		this.scale.

		this.layoutEngine.layout( this.rect );
		this.components.forEach( c => {
			c.update( data, options );
		} );
	}
}
