export default class Rect {
	constructor( x = 0, y = 0, width = 0, height = 0 ) {
		this.set( x, y, width, height );
	}

	set ( x = 0, y = 0, width = 0, height = 0 ) {
		if ( width >= 0 ) {
			this.x = x;
			this.width = width;
		}
		else {
			this.x = x + width;
			this.width = -width;
		}
		if ( height >= 0 ) {
			this.y = y;
			this.height = height;
		}
		else {
			this.y = y + height;
			this.height = -height;
		}
	}

	points () {
		return [
			{ x: this.x, y: this.y },
			{ x: this.x + this.width, y: this.y },
			{ x: this.x + this.width, y: this.y + this.height },
			{ x: this.x, y: this.y + this.height }
		];
	}
}
