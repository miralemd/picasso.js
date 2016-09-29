import { register as regRenderer } from "../core/renderer";
import { renderer as svg } from "./renderer/svg-renderer/svg-renderer";
import { renderer as canvas } from "./renderer/canvas-renderer";

regRenderer( "svg", svg );
regRenderer( "canvas", canvas );

import { register as regFormatter } from "../core/formatter";
import { formatter as d3format } from "./formatter/d3";

regFormatter( "d3", d3format );
