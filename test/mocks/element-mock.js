function element( name ) {
	return {
		name,
		attributes: {},
		children: [],
		parentNode: null,
		ownerDocument: {
			createElementNS: function( ns, name ) {
				return element( `${ns}:${name}` );
			},
			createElement: function( name ) {
				return element( name );
			}
		},
		cloneNode: function( b ) {
			var ret = element( this.name );
			if( b ) {
				ret.children = b.children.slice();
			}
			return ret;
		},
		replaceChild: function( add, remove ) {
			this.children.splice( this.children.indexOf( remove ), 1, add );
		},
		setAttribute: function( name, value) {
			this.attributes[name] = value;
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
