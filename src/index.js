import { barChart } from "./charts/barchart/barchart";
import { barArea } from "./chart-components/bar-area";
import { axis } from "./chart-components/axis";
import { linear } from "./scales/linear";
import { dockLayout } from "./chart-components/dock-layout";
import { default as ticker } from "./scales/ticks";
import { dataMatrix } from "./data/data-matrix";
import { default as color } from "./colors/index";

export default {
	charts: {
		barChart
	},
	components: {
		axis,
		barArea
	},
	scales: {
		linear,
		ticker
	},
	utils: {
		dockLayout
	},
	data: {
		dataMatrix
	},
	color
};
