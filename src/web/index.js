import "./css/picasso.less";

import { register } from "../core/renderer";
import { renderer as svg } from "./renderer/svg-renderer/svg-renderer";

register( "svg", svg );
