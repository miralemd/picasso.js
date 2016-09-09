export default class Circle {
	constructor ( cx = 0, cy = 0, r = 0 ) {
		this.set( cx, cy, r );
	}

	set ( cx, cy, r ) {
		this.cx = cx;
		this.cy = cy;
		this.r = r;
	}

	bounds () {
		let x = this.cx - this.r,
			y = this.cy - this.r,
			s = this.r * 2;
		return [
			{ x: x, y: y },
			{ x: x + s, y: y },
			{ x: x + s, y: y + s },
			{ x: x, y: y + s }
		];
	}
}
