import Node from "./node";

export default class NodeContainer extends Node {
	addChild( c ) {
		if ( !c || !( c instanceof Node ) ) {
			throw new TypeError( "Expecting a Node as argument, but got " + c );
		}

		if ( c === this ) {
			throw "Can not add itself as child!";
		}

		if ( c._children && c._children.length && this.ancestors.indexOf( c ) >= 0 ) {
			throw "Can not add an ancestor as child!";
		}

		if ( c._parent && c._parent !== this ) {
			c._parent.removeChild( c );
		}

		//*
		// really expensive for large arrays
		let indx = this._children.indexOf( c ); // if child already exists -> remove it, and the push it in last
		if ( indx >= 0 ) {
			this._children.splice( indx, 1 );
		}
		//*/

		this._children.push( c );
		c._parent = this;
		c._ancestors = null;

		return this;
	}

	addChildren( children ) {
		let i, num = children ? children.length : 0;
		for ( i = 0; i < num; i++ ) {
			this.addChild( children[i] );
		}
		return this;
	}

	/**
	 * Removes given child node from this node.
	 * @param {Node} c
	 * @returns {Node} This object, for chaining purposes.
	 */
	removeChild( c ) {
		let indx = this._children.indexOf( c );
		if ( indx >= 0 ) {
			this._children.splice( indx, 1 );
			c._parent = null;
			c._ancestors = null;
		}
		return this;
	}

	removeChildren( children ) {
		let i, num;
		if ( !this._children ) {
			return this;
		}
		if ( children ) {
			num = children.length;
			for ( i = 0; i < num; i++ ) {
				this.removeChild( children[i] );
			}
		}
		else {
			while ( this._children.length ) {
				this.removeChild( this._children[0] );
			}
		}
		return this;
	}
}
