import DisplayObject from "./display-object";
import NodeContainer from "../node-container";

let UNDEF;
const NC = NodeContainer.prototype;

export default class Container extends DisplayObject {
	addChild ( c ) {
		return NC.addChild.call( this, c );
	}

	addChildren ( children ) {
		return NC.addChildren.call( this, children );
	}

	removeChild ( c ) {
		c._stage = null;
		let desc = c.descendants,
			num = desc ? desc.length : 0,
			i;
		// remove reference to stage from all descendants
		for ( i = 0; i < num; i++ ) {
			desc[i]._stage = null;
		}

		NC.removeChild.call( this, c );
		return this;
	}

	removeChildren ( children ) {
		return NC.removeChildren.call( this, children );
	}

	localBounds () {
		let initiated = false,
			minX, minY, maxX, maxY,
			b, i, len;
		if ( this._children && this._children.length ) {
			for ( i = 0, len = this._children.length; i < len; i++ ) {
				b = this._children[i].visualBounds();
				if ( !b || isNaN( b.width + b.height + b.x + b.y ) ) {
					continue;
				}

				if ( !initiated ) {
					minX = b.x;
					maxX = b.x + b.width;
					minY = b.y;
					maxY = b.y + b.height;
					initiated = true;
				}
				else {
					minX = Math.min( minX, b.x );
					maxX = Math.max( maxX, b.x + b.width );
					minY = Math.min( minY, b.y );
					maxY = Math.max( maxY, b.y + b.height );
				}
			}
			return initiated ? {
				x: minX,
				y: minY,
				width: maxX - minX,
				height: maxY - minY
			} : UNDEF;
		}
		return UNDEF;
	}

	_calculateBounds () {
		let b = this._scene.bounds.o,
			o = this.localBounds(),
			s = 0;

		if ( o ) {
			b.set( o.x, o.y, o.width, o.height );
			this._scene.bounds.vm.set( o.x, o.y, o.width, o.height );
			this._scene.bounds.visual.set( o.x - s, o.y - s, o.width + s * 2, o.height + s * 2 );
		}
		else {
			b.set( NaN, NaN, NaN, NaN );
			this._scene.bounds.vm.set( NaN, NaN, NaN, NaN );
			this._scene.bounds.visual.set( NaN, NaN, NaN, NaN );
		}

		this._scene.bounds.dirty = false;
	}
}

export function create() {
	return new Container();
}
