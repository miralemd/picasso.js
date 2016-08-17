import { renderer, register } from "./renderer";
import { renderer as svg } from "../../web/renderer/svg-renderer/svg-renderer";

register( "svg", svg );

export { renderer, register };
