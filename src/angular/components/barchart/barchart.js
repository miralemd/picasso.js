import picasso from "picasso";

export default function barchartDirective() {
	return {
		scope: {},
		bindToController: {
			data: "="
		},
		replace: true,
		template: `
			<div class="pic-chart">
				<pic-axis model="ctrl.barchart.measureAxis"></pic-axis>
				<pic-axis model="ctrl.barchart.dimensionAxis"></pic-axis>
				<pic-bararea model="ctrl.barchart.barArea"></pic-bararea>
			</div>
		`,
		controller: function( $element ) {
			let vm = this,
				w = $element[0].clientWidth,
				h = $element[0].clientHeight,
				barchart = new picasso.charts.BarChart();

			vm.barchart = barchart;
			barchart.rect.width = w;
			barchart.rect.height = h;

			barchart.data( vm.data );
			barchart.resize();
		},
		controllerAs: "ctrl"
	};
}
