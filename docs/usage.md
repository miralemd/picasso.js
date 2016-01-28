# How to use picasso.js

## A Bar chart example in the browser

First, follow the instructions on [How to build](../README.md) to generate the required files for this example.

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Picasso example</title>

	<!-- import picasso and its dependencies-->
	<script src="../dist/picasso.js"></script>
	<script src="../dist/picasso-angular.js"></script>
	<script src="../node_modules/angular/angular.js"></script>
</head>
<body>
	<chart></chart>

	<script>
		var app = angular.module( "app", [] )
			.directive( "chart", function() {
				return {
					scope: {},
					replace: true,
					template: "<div><pic-barchart data='ctrl.data'></pic-barchart></div>",
					controller: function() {
						this.data = [
							["A", 9, 7],
							["B", 3, 1],
							["C", 6, 9],
							["D", 4, 3],
							["E", 13, 6],
							["F", 7, 8],
							["H", 2, 4]
						];
					},
					controllerAs: "ctrl"
				};
			} );

		var pico = window["picasso-angular"];
		pico.init();
		angular.bootstrap( document, [app.name, pico.module.name] );
	</script>
</body>
</html>
```
