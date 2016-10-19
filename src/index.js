import { chart } from "./core/charts/chart";
import { renderer } from "./core/renderer";
import { register as registerFormatter } from "./core/formatter";
import { qTable } from "./core/data/q/q-table";
import "./web";

/**
 * The mother of all namespaces
 * @namespace picasso
 */

export {
	chart,
	renderer,
	registerFormatter,
	qTable
};
