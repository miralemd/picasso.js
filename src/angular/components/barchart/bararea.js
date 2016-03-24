import { addComponent } from "../../components";

class BarAreaController {
	$onInit() {
		var vm = this;

		vm.rects = [];
		vm.rect = vm.model.rect;

		vm.model.on( "changed", () => {
			vm.rects = vm.model.rects ? vm.model.rects.map( b => {
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

addComponent( "picBarArea", {
	bindings: {
		model: "="
	},
	template: `
		<div class="pic-bararea pic-chart-component"
			ng-style="{left: ctrl.rect.x + 'px', top: ctrl.rect.y + 'px', width: ctrl.rect.width + 'px', height: ctrl.rect.height + 'px'}">
			<div ng-repeat="r in ctrl.rects" ng-style="r.style" style="position:absolute;"></rect>
		</div>
	`,
	controller: BarAreaController,
	controllerAs: "ctrl"
} );
