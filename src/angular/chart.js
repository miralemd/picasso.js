import pic from "./picasso-angular-core";
import { addDirective } from "./components";

addDirective( "picChartContent", function() {
	return {
		scope: {
			data: "=",
			options: "="
		},
		restrict: "E",
		replace: true,
		template: "",
		link: function( scope, element ) {
			element.append( pic.compile( `<pic-${scope.options.type} data='data' options='options'></pic-${scope.options.type}>` )( scope ) );
		}
	};
} );

addDirective( "picChart", function() {
	return {
		scope: {
			data: "=",
			options: "="
		},
		restrict: "E",
		replace: true,
		template: `
		<div class="pic-chart">
			<div class="pic-chart__title">Title goes here</div>
			<div class="pic-chart__subtitle">Subtitle goes here</div>
			<pic-chart-content class="pic-chart__content" data='data' options='options'></pic-chart-content>
			<div class="pic-chart__subtitle">Footnote goes here</div>
		</div>
		`
	};
} );
