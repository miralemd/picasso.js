export default class Nominal {
	constructor() {
		this.levels = [];
		this.output = [0, 1];
	}

	setData( data = [], options = {} ) {
		this.data = data;

		let levels = [],
			groupDiff = options.separation || 0.5,
			idx = 0;
		function traverse( arr, depth = 0 ) {

			let level = levels[depth] = levels[depth] || [];
			arr.forEach( (node, i, a) => {

				if ( typeof node === "string" ) {
					level.push( {
						name: node,
						idx: idx
					} );
				}
				else {
					level.push( {
						name: node.name,
						idx: idx
					} );

					if ( node.children && node.children.length ) {
						traverse( node.children, depth + 1 );
					}
				}
				if ( node.children && node.children.length && i < a.length - 1 ) {
					idx += groupDiff;
				}
				else {
					idx++;
				}

			} );
		}

		traverse( data );

		this.levels = levels;
		this.unitSize = Math.abs(this.output[0] - this.output[1]) / (idx - (this.levels.length > 1 ? 1 : 0) || 1);
		return this;
	}

	getLevels() {
		return this.levels;
	}

	getUnitSize() {
		return this.unitSize;
	}

	get( idx, level = this.levels.length - 1 ) {
		let lev = this.levels[level],
			start = lev[idx].idx;

		return start * this.unitSize + this.unitSize * 0.5;
	}
}
