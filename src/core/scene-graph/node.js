export default class Node {
	constructor() {
		this._parent = null;
		this._children = [];
		this._ancestors = null;
		this.data = {};
	}

	/**
	 * Detaches this node from its parent, if such exists.
	 * @returns {Node}
	 */
	detach() {
		if ( this._parent ) {
			this._parent.removeChild( this );
		}
		return this;
	}

	/**
	 * Parent of this node.
	 * @readonly
	 * @type {Node}
	 */
	get parent() {
		return this._parent;
	}

	/**
	 * Checks whether this node is a branch.
	 * @readonly
	 * @type {Boolean} True if this node has children, false otherwise.
	 */
	get isBranch () {
		return this._children && this._children.length;
	}

	/**
	 * Children of this node.
	 * @readonly
	 * @type {Node[]}
	 */
	get children() {
		return this._children;
	}

	/**
	 * Ancestors of this node, including parent.
	 * @readonly
	 * @type {Node[]}
	 */
	get ancestors () {
		if ( !this._ancestors ) {
			let p = this._parent;
			this._ancestors = p ? [p].concat( p.ancestors ) : [];
		}

		return this._ancestors;
	}

	/**
	 * Descendants of this node.
	 * @readonly
	 * @type {Node[]}
	 */
	get descendants () {
		let r = [], i, len, c;

		for ( i = 0, len = this._children.length; i < len; i++ ) {
			c = this._children[i];
			r.push( c );

			if ( c._children.length ) {
				r = r.concat( c.descendants );
			}
		}
		return r;
	}
}
