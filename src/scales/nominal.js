function getLabelsMeta( data, options ) {
	let levels = [],
		groupDiff = options.separation,
		units = 0;
	function traverse( arr, depth = 0 ) {

		let level = levels[depth] = levels[depth] || [];
		arr.forEach( (node, i, a) => {

			if ( typeof node === "string" ) {
				level.push( {
					name: node,
					idx: units
				} );
			}
			else {
				level.push( {
					name: node.name,
					idx: units
				} );

				if ( node.children && node.children.length ) {
					traverse( node.children, depth + 1 );
				}
			}
			if ( node.children && node.children.length && i < a.length - 1 ) {
				units += groupDiff;
			}
			else {
				units++;
			}

		} );
	}

	traverse( data );

	return { levels, units };
}

function getUnitSize( min, max, units, levels ) {
	return Math.abs( max - min ) / (units - (levels.length > 1 ? 1 : 0) || 1);
}

export default class Nominal {
	constructor( from = [], to = [0, 1], options = {} ) {
		this.groupSeparation = options.groupSeparation || 0.5;
		this.output = to;
		this.from( from );
	}

	from( values ) {
		this.domain = values;
		let {levels, units} = getLabelsMeta( values, {separation: this.groupSeparation} );

		this.levels = levels;
		this.units = units;
		this.unitSize = getUnitSize( this.output[1], this.output[0], this.units, this.levels );
		return this;
	}

	to( values ) {
		this.output = values;
		this.unitSize = getUnitSize( this.output[1], this.output[0], this.units, this.levels );
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
