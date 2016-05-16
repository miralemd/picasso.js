export default class DockLayout {
	constructor() {
		this.components = [];
	}

	/**
	 * Adds a new component to be included in the layout
	 * @param component
	 */
	addComponent( component ) {
		// remove if exist and add last in array
		this.removeComponent( component );
		this.components.push( component );
	}

	removeComponent( component ) {
		var idx = this.components.indexOf( component );
		if ( idx > -1 ) {
			this.components.splice( idx, 1 );
		}
	}

	layout( rect ) {
		var reduced = DockLayout.reduceLayoutRect( this.components, rect );
		DockLayout.positionComponents( this.components, reduced );
	}

	static reduceLayoutRect( components, rect ) {

		var reducedRect = {
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height
		};
		components.filter( c => ["left", "top", "right", "bottom"].indexOf( c.dock ) !== -1 ).forEach( c => {

			c.calculateRelevantSize( rect );

			switch ( c.dock ) {
				case "top":
					reducedRect.y += c.relevantSize;
					reducedRect.height -= c.relevantSize;
					break;
				case "bottom":
					reducedRect.height -= c.relevantSize;
					break;
				case "left":
					reducedRect.x += c.relevantSize;
					reducedRect.width -= c.relevantSize;
					break;
				case "right":
					reducedRect.x += c.relevantSize;
			}
			// console.log( reducedRect );
		} );

		return reducedRect;
	}

	static positionComponents( components, rect ) {

		var vRect = { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
			hRect = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };


		components.sort( ( a, b ) => a.order - b.order ).forEach( c => {

			switch ( c.dock ) {
				case "top":
					c.rect.height = c.relevantSize;
					c.rect.width = vRect.width;
					c.rect.x = vRect.x;
					c.rect.y = vRect.y - c.relevantSize;

					vRect.y -= c.relevantSize;
					vRect.height += c.relevantSize;
					break;
				case "bottom":
					c.rect.x = vRect.x;
					c.rect.y = vRect.y + vRect.height;
					c.rect.width = vRect.width;
					c.rect.height = c.relevantSize;

					vRect.height += c.relevantSize;
					break;
				case "left":
					c.rect.x = hRect.x - c.relevantSize;
					c.rect.y = hRect.y;
					c.rect.width = c.relevantSize;
					c.rect.height = hRect.height;

					hRect.x -= c.relevantSize;
					hRect.width += c.relevantSize;
					break;
				case "right":
					c.rect.x = hRect.x + hRect.width;
					c.rect.y = hRect.y;
					c.rect.width = c.relevantSize;
					c.rect.height = hRect.height;

					hRect.width += c.relevantSize;
					break;
				default:
					c.rect.x = rect.x;
					c.rect.y = rect.y;
					c.rect.width = rect.width;
					c.rect.height = rect.height;
			}
		} );
	}
}

export function dockLayout() {
	return new DockLayout();
}
