import { register } from "../core/renderer";
import { renderer as svg } from "./renderer/svg-renderer/svg-renderer";
import { renderer as canvas } from "./renderer/canvas-renderer";

register( "svg", svg );
register( "canvas", canvas );
