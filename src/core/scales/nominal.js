function getLabelsMeta( data, options ) {
	let levels = [],
		groupDiff = options.separation,
		units = 0;
	function traverse( arr, depth = 0 ) {

		let level = levels[depth] = levels[depth] || [];
		arr.forEach( ( node, i, a ) => {
			let spanStart = units,
				obj = {
					name: typeof node === "string" ? node : node.name,
					idx: units,
					span: 1
				};

			level.push( obj );
			if ( node.children && node.children.length ) {
				traverse( node.children, depth + 1 );
				obj.span = units - spanStart;
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
	return Math.abs( max - min ) / ( units - ( levels.length > 1 ? 1 : 0 ) || 1 );
}

export default class Nominal {
	constructor( from = [], to = [0, 1], options = {} ) {
		this.groupSeparation = options.groupSeparation || 0.5;
		this.output = to;
		this.from( from );
		this.ticks = [];
		this.isDiscrete = true;
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

	update() {
		this.ticks = !this.levels || !this.levels.length ? [] : this.levels[this.levels.length - 1].map( ( a, i ) => i );
	}

	getLevels() {
		return this.levels;
	}

	getUnitSize() {
		return this.unitSize;
	}

	getRange( idx, level = this.levels.length - 1 ) {
		let lev = this.levels[level],
			range = lev[idx].span,
			start = lev[idx].idx;

		return {
			start: start * this.unitSize, // - this.unitSize * range * 0.5,
			end: start * this.unitSize + this.unitSize * range
		};
	}

	get( idx, level = this.levels.length - 1 ) {
		let lev = this.levels[level],
			start = lev[idx].idx;

		return start * this.unitSize + this.unitSize * 0.5;
	}
}

export function nominal( ...a ) {
	return new Nominal( ...a );
}
