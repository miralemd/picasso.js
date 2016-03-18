import { addComponent } from "../../components";

addComponent( "picAxis", {
	bindings: {
		model: "="
	},
	template: `
		<div class="pic-axis pic-chart-component" ng-class="{'pic-axis--horizontal': !ctrl.isVertical, 'pic-axis--vertical': ctrl.isVertical}"
			ng-style="{left: ctrl.rect.x + 'px', top: ctrl.rect.y + 'px', width: ctrl.rect.width + 'px', height: ctrl.rect.height + 'px'}">
			<div class="pic-axis__tick" ng-repeat="tick in ctrl.ticks" ng-style="{top: ctrl.isVertical ? (100-100*tick.position) + '%' : '', left: !ctrl.isVertical ? (100*tick.position) + '%': ''}" style="position:absolute;">
				<span class="pic-axis__tick__tick"></span>
				</div>
				<div ng-repeat="level in ctrl.labels">
				<div class="pic-axis__tick" ng-repeat="label in level" ng-style="{top: ctrl.isVertical ? (100-100*label.position) + '%' : '', left: !ctrl.isVertical ? (100*label.start) + '%': '', width: !ctrl.isVertical ? (100*(label.end-label.start)) + '%': ''}" style="position:absolute;">
					<span class="pic-axis__tick__label">{{label.label}}</span>
					</div>
					</div>
					<div class="pic-axis__line"></div>
					</div>
	`,
	controller: function( $scope ) {
		let vm = this;
		$scope.$watch( "ctrl.model.ticks", () => {
			vm.rect = this.model.rect;
			vm.isVertical = this.model.isVertical;
			vm.ticks = this.model.ticks[0];
			vm.labels = [this.model.labels[0]];
		} );
	},
	controllerAs: "ctrl"
} );
