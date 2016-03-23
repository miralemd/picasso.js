import { addComponent } from "../../components";

class BarAreaController {
	constructor( $scope ) {
		this.$scope = $scope;
	}

	$onInit() {
		var vm = this,
			bararea = vm.model;

		vm.bararea = bararea;
		vm.rects = [];
		this.$scope.$watch( "ctrl.bararea.rects", () => {
			vm.rects = vm.bararea.rects ? vm.bararea.rects.map( b => {
				return {
					style: {
						left: b.x + "px",
						top: b.y + "px",
						width: b.width + "px",
						height: b.height + "px",
						background: b.fill
					}
				};
			} ) : [];
		} );
	}
}

BarAreaController.$inject = ["$scope"];

addComponent( "picBarArea", {
	bindings: {
		model: "="
	},
	template: `
		<div class="pic-bararea pic-chart-component"
			ng-style="{left: ctrl.bararea.rect.x + 'px', top: ctrl.bararea.rect.y + 'px', width: ctrl.bararea.rect.width + 'px', height: ctrl.bararea.rect.height + 'px'}">
			<div ng-repeat="r in ctrl.rects" ng-style="r.style" style="position:absolute;"></rect>
		</div>
	`,
	controller: BarAreaController,
	controllerAs: "ctrl"
} );
