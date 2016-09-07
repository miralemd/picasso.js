import Node from "../node";
import Matrix from "../../math/matrix";
import GeometricalRect from "../../geometry/rect";

let transform = {
	translate: function translate( x, y ) {
		this.matrix.translate( x, y );
		this._scene.bounds.dirty = true;
		return this;
	},

	rotate: function rotate( radians ) {
		this.matrix.rotate( radians );
		this._scene.bounds.dirty = true;
		return this;
	},

	scale: function scale( x, y ) {
		this.matrix.scale( x, y );
		this.bounds.dirty = true;
		return this;
	}
};

function initMatrix() {
	this.matrix = new Matrix();
	this.scale = transform.scale;
	this.rotate = transform.rotate;
	this.translate = transform.translate;
	this._scene.bounds.dirty = true;
}

/**
 * Calculates the bounds of `r´ as transformed by `matrix`
 */
function getTransformedBoundsOfRect( matrix, r ) {
	let points, px, py, minX, minY, maxX, maxY;
	points = matrix.transformPoints( [
		{ x: r.x, y: r.y },
		{ x: r.x + r.width, y: r.y },
		{ x: r.x + r.width, y: r.y + r.height },
		{ x: r.x, y: r.y + r.height }
	] );
	px = points.map( p => p.x );
	py = points.map( p => p.y );
	minX = Math.min( ...px );
	maxX = Math.max( ...px );
	minY = Math.min( ...py );
	maxY = Math.max( ...py );
	return new GeometricalRect( minX, minY, maxX - minX, maxY - minY );
}

export default class DisplayObject extends Node {
	constructor () {
		super();
		this._stage = null;
		this._scene = {
			inherited: {},
			modelView: null,
			inverseModelView: null,
			bounds: {
				dirty: true,
				o: new GeometricalRect( NaN, NaN, NaN, NaN ), // geometrical bounds in object space
				vm: new GeometricalRect( NaN, NaN, NaN, NaN ), // geometrical bounds in view space
				visual: new GeometricalRect( NaN, NaN, NaN, NaN ) // visual bounds in view space
			}
		};
	}

	translate ( x, y ) {
		if ( x === 0 && y === 0 ) {
			return this;
		}
		initMatrix.call( this );
		return transform.translate.call( this, x, y );
	}

	rotate ( radians ) {
		if ( isNaN( radians ) || radians === 0 ) {
			return this;
		}
		initMatrix.call( this );
		return transform.rotate.call( this, radians );
	}

	scale ( x, y ) {
		if ( x === 1 ) {
			return this;
		}
		initMatrix.call( this );
		return transform.scale.call( this, x, y );
	}

	clearTransform () {
		if ( this.matrix ) {
			this.matrix.identity();
			this._scene.bounds.dirty = true;
		}
		return this;
	}

	/**
	 * Returns the value of attribute a.
	 * @param a
	 * @returns {*} The value of attribute a.
	 */
	attr( a ) {
		return this[a];
	}

	/**
	 * Sets attributes on this object
	 * @example
	 * node.attrs( {x: 2} )
	 * @param {Object} attributes
	 * @returns {DisplayObject} This object
	 */
	attrs( attributes ) {
		for ( let a in attributes ) {
			if ( typeof attributes[a] === "undefined" ) {
				delete this[a];
			}
			else {
				this[a] = attributes[a];
			}
		}
		return this;
	}

	/**
	 * Returns a bounding box that completely encloses the geometric object.
	 * @returns {Rect} A rectangle specifiying the current geometric bounds of this object.
	 */
	bounds() {
		if ( this._scene.bounds.dirty ) {
			this._calculateBounds();
		}
		return this._scene.bounds.vm;
	}

	/**
	 * Returns a bounding box that completely encloses the object.
	 * @returns {Rect} A rectangle specifiying the current visual bounds of this object.
	 */
	visualBounds() {
		if ( this._scene.bounds.dirty ) {
			this._calculateBounds();
		}
		return this._scene.bounds.visual;
	}

	/**
	 * The number of pixels the object bleeds beyond its geometrical border.
	 *
	 * The visual boundary of a shape may sometime be larger than its geometric definition. This occurs, for instance,
	 * when a rectangle has a very thick border which causes the rectangle to appear larger than its geometric boundary.
	 * The default behaviour does not take shapes with excessive miters into account.
	 * @example
	 * var r = new Rect( 0, 0, 4, 6 );
	 * r.stroke = "red";
	 * r.strokeWidth = 4;
	 * // In most drawing application, half of the border will be drawn outside the rectangle. This will result in a visual expansion of 2px (half stroke width)
	 * r.visualExpansion(); // -> 2
	 * @returns {number} The amount of pixels this objects visual representation bleeds in each direction outside of its geometric boundary.
	 */
	visualExpansion() {
		let stroke = this.attr( "stroke" ),
			strokeWidth;
		if ( !stroke ) {
			return 0;
		}
		strokeWidth = this.attr( "strokeWidth" );
		if ( !strokeWidth ) {
			return 0;
		}
		return strokeWidth / 2;
	}

	/**
	 * Returns a bounding box that completely encloses the object.
	 * @returns {Rect} A rectangle specifiying the current bounds of this object.
	 */
	localBounds() {
		return this._scene.bounds.o;
	}

	/**
	 * Invalidates the bounds of this object and sets the dirty bounds flag to true.
	 * Should be called when the objects geometrical boundary changes.
	 * @example
	 * var rect = new Rect( 1, 2, 3, 4 );
	 * rect.x = 5;
	 * rect.invalidateBounds(); // sets dirty bounds flag to true
	 * var myBounds = rect.bounds // calls _calculateBounds() and resets dirty bounds flag
	 * @returns {DisplayObject} This object
	 */
	invalidateBounds() {
		this._scene.bounds.dirty = true;
		return this;
	}

	clearModelView() {
		this._scene.modelView = null;
		this._scene.inverseModelView = null;
		this._scene.isModelViewCalculated = false;
		this._scene.bounds.dirty = true;
	}

	modelView() {
		if ( !this._scene.modelView && !this._scene.isModelViewCalculated ) {
			this._calculateModelView();
		}
		return this._modelView;
	}

	inverseModelView() {
		if ( !this._inverseModelView && !this._scene.isModelViewCalculated ) {
			this._calculateModelView();
		}
		return this._scene.inverseModelView;
	}

	destroy() {
		this._stage = null;
	}

	/**
	 * Calculates the bounds of this object.
	 * @private
	 */
	_calculateBounds() {
		let b = this._scene.bounds.o,
			o = this.localBounds(),
			mv = this.modelView(),
			s = this.visualExpansion(),
			t;

		if ( o ) {
			b.set( o.x, o.y, o.width, o.height );

			if ( mv ) {
				// get the boundary rect of the bounding rectangle after transformation
				t = getTransformedBoundsOfRect( mv, b );
				this._scene.bounds.vm.set( t.x, t.y, t.width, t.height );

				t = getTransformedBoundsOfRect( mv, {
					x: b.x - s,
					y: b.y - s,
					width: b.width + s * 2,
					height: b.height + s * 2
				} );
				this._scene.bounds.visual.set( t.x, t.y, t.width, t.height );
			}
			else {
				this._scene.bounds.vm.set( o.x, o.y, o.width, o.height );
				this._scene.bounds.visual.set( o.x - s, o.y - s, o.width + s * 2, o.height + s * 2 );
			}
		}
		else {
			b.set( NaN, NaN, NaN, NaN );
			this._scene.bounds.vm.set( NaN, NaN, NaN, NaN );
			this._scene.bounds.visual.set( NaN, NaN, NaN, NaN );
		}

		this._scene.bounds.dirty = false;
	}

	/**
	 *
	 * @returns {boolean} True if the model view was updated, false otherwise.
	 * @private
	 */
	_calculateModelView() {
		let n = this;
		while ( n && !n._scene.vmTransform ) {
			n = n._parent;
		}

		this._scene.isModelViewCalculated = true; // to avoid traversing tree when this object does not have an own matrix

		if ( !n ) {
			return false;
		}

		if ( !n._scene.modelView ) {
			n._scene.modelView = new Matrix();
			n._scene.inverseModelView = new Matrix();
		}
		if ( n._scene.dirtyVMTransform ) {
			n._scene.modelView.set( n._scene.vmTransform );
			n._scene.inverseModelView.set( n._scene.vmTransform ).invert();
			delete n._scene.dirtyVMTransform;
		}
		this._scene.modelView = n._scene.modelView;
		this._scene.inverseModelView = n._scene.inverseModelView;
		return true;
	}

	get stage() {
		if ( this._parent && !this._stage ) {
			this._stage = this._parent.stage;
		}
		else if ( !this._parent && this._stage !== this ) {
			this._stage = null;
		}
		return this._stage;
	}
}
