import picasso from "picasso";
import { addComponent } from "../../components";

class BarChartController {
	constructor( $element, $timeout ) {
		this.$element = $element;
		this.$timeout = $timeout;
	}

	$onInit() {
		let vm = this,
			elem = this.$element,
			w, h,
			barchart = picasso.charts.barChart();
		vm.barchart = barchart;

		this.$timeout( () => {
			w = elem[0].clientWidth;
			h = elem[0].clientHeight;

			barchart.rect.width = w;
			barchart.rect.height = h;

			barchart.data( vm.data );
			barchart.resize();
		}, 0 );
	}
}

BarChartController.$inject = ["$element", "$timeout"];

addComponent( "picBarChart", {
	bindings: {
		data: "="
	},
	template: `
		<pic-axis model="ctrl.barchart.measureAxis"></pic-axis>
		<pic-axis model="ctrl.barchart.dimensionAxis"></pic-axis>
		<pic-bar-area model="ctrl.barchart.barArea"></pic-bar-area>
	`,
	controller: BarChartController,
	controllerAs: "ctrl"
} );
