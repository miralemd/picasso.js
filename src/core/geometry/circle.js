export default class Circle {
	constructor ( cx = 0, cy = 0, radius = 0 ) {
		this.set( cx, cy, radius );
	}

	set ( cx, cy, radius ) {
		this.cx = cx;
		this.cy = cy;
		this.radius = radius;
	}

	bounds () {
		let x = this.cx - this.radius,
			y = this.cy - this.radius,
			s = this.radius * 2;
		return [
			{ x: x, y: y },
			{ x: x + s, y: y },
			{ x: x + s, y: y + s },
			{ x: x, y: y + s }
		];
	}
}
