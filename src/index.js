import "./web/css/picasso.less";

import { barChart } from "./core/charts/barchart/barchart";
import { barArea } from "./core/chart-components/bar-area";
import { axisContinuous } from "./core/chart-components/axis-continuous";
import { axisDiscrete } from "./core/chart-components/axis-discrete";
import { linear } from "./core/scales/linear";
import { ordinal } from "./core/scales/ordinal";
import { band } from "./core/scales/band";
import { dockLayout } from "./core/chart-components/dock-layout";
import { default as ticker } from "./core/scales/ticks";
import { dataMatrix } from "./core/data/data-matrix";
import { default as color } from "./core/colors/index";
import { default as svg } from "./web/renderer/svg-renderer/svg-renderer";
import { axis } from "./web/axis-svg-renderer";

export default {
	charts: {
		barChart
	},
	components: {
		barArea,
		axisContinuous,
		axisDiscrete
	},
	scales: {
		linear,
		ticker,
		ordinal,
		band
	},
	utils: {
		dockLayout
	},
	data: {
		dataMatrix
	},
	color,
	renderers: {
		svg,
		axis
	}
};
