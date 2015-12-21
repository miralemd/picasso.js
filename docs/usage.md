# How to use picasso.js

## A Bar chart example
```
// <!-- import picasso -->
<script src="../dist/index.js"></script>
```

```
var chart = new picasso.charts.BarChart( document.querySelector( "#container" ) );

chart.render( {
	matrix: [
		["Row 1", 5, 7],
		["Row 2", 13, 4],
		["Row 3", 8, 2],
		["Row 4", 3, 1],
		["Row 5", 11, 9],
		["Row 6", 7, 6]
	],
	options: {
		width: 0.8, // bar width ratio
		separation: 0.5 // separation between groups
	}
} );
```
