import "./web/css/picasso.less";

import { barChart } from "./core/charts/barchart/barchart";
import { barArea } from "./core/chart-components/bar-area";
import { axis } from "./core/chart-components/axis";
import { linear } from "./core/scales/linear";
import { dockLayout } from "./core/chart-components/dock-layout";
import { default as ticker } from "./core/scales/ticks";
import { dataMatrix } from "./core/data/data-matrix";
import { default as color } from "./core/colors/index";
import { default as svg } from "./web/renderer/svg-renderer/svg-renderer";

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
	color,
	renderers: {
		svg
	}
};
