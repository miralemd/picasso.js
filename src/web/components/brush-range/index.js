import rangeBrushComponent from './brush-range';
import brushAreaDirectionalComponent from './brush-area-dir';

export default function rangeBrush(picasso) {
  picasso.component('brush-range', rangeBrushComponent);
  picasso.component('brush-area-dir', brushAreaDirectionalComponent);
}
