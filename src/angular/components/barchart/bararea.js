export default function barareaDirective() {
	return {
		scope: {},
		bindToController: {
			model: "="
		},
		replace: true,
		template: `
			<div class="pic-bararea pic-chart-component"
				ng-style="{left: ctrl.bararea.rect.x + 'px', top: ctrl.bararea.rect.y + 'px', width: ctrl.bararea.rect.width + 'px', height: ctrl.bararea.rect.height + 'px'}">
				<div ng-repeat="r in ctrl.rects" ng-style="r.style" style="position:absolute;"></rect>
			</div>
		`,
		controller: function( $scope ) {
			var vm = this,
				bararea = vm.model;

			vm.bararea = bararea;
			vm.rects = [];
			$scope.$watch( "ctrl.bararea.rects", () => {
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
		},
		controllerAs: "ctrl"
	};
}
