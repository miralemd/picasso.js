import BarChart from "./charts/barchart/barchart";
import BarArea from "./chart-components/bararea";
import Axis from "./chart-components/axis";
import LinearScale from "./scales/linear";
import LayoutEngine from "./chart-components/layout-engine";
import {default as ticker} from "./scales/ticks";
import dataMatrix from "./data/data-matrix";

export default {
	charts: {
		BarChart
	},
	components: {
		Axis,
		BarArea
	},
	scales: {
		LinearScale,
		ticker
	},
	utils: {
		LayoutEngine
	},
	data: {
		dataMatrix
	}
};
