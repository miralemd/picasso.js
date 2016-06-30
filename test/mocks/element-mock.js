function element( name ) {
	return {
		name,
		attributes: {},
		style: {},
		children: [],
		parentNode: null,
		ownerDocument: {
			createElementNS: function( ns, tag ) {
				return element( `${ns}:${tag}` );
			},
			createElement: function( tag ) {
				return element( tag );
			}
		},
		cloneNode: function( b ) {
			let ret = element( this.name );
			if ( b ) {
				ret.children = b.children.slice();
			}
			return ret;
		},
		replaceChild: function( add, remove ) {
			this.children.splice( this.children.indexOf( remove ), 1, add );
		},
		setAttribute: function( attr, value ) {
			this.attributes[attr] = value;
		},
		appendChild: function( el ) {
			this.children.push( el );
			el.parentNode = this;
		},
		removeChild: function( el ) {
			this.children.splice( this.children.indexOf( el ), 1 );
			el.parentNode = null;
		}
	};
}

export default element;
