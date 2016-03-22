import picasso from "picasso";
import { addComponent } from "../../components";

addComponent( "picBarChart", {
		bindings: {
			data: "="
		},
		template: `
			<!--<div class="pic-chart">-->
				<pic-axis model="ctrl.barchart.measureAxis"></pic-axis>
				<pic-axis model="ctrl.barchart.dimensionAxis"></pic-axis>
				<pic-bar-area model="ctrl.barchart.barArea"></pic-bar-area>
			<!--</div>-->
		`,
		controller: function( $element ) {
			$element.addClass("pic-chart");
			let vm = this,
				w = $element[0].clientWidth,
				h = $element[0].clientHeight,
				barchart = picasso.charts.barChart();

			vm.barchart = barchart;
			barchart.rect.width = w;
			barchart.rect.height = h;

			barchart.data( vm.data );
			barchart.resize();
		},
		controllerAs: "ctrl"
} );
