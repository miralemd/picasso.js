export default {
	getColumnMetaData( matrix = [] ) {
		let columns = [];

		if ( matrix[0] ) {
			matrix[0].forEach( value => {
				columns.push( {
					type: typeof value === "number" ? "numeric" : "string",
					values: []
				} );
			} );
		}
		matrix.forEach( row => {
			for ( let c = 0, len = row.length; c < len; c++ ) {
				columns[c].values.push( row[c] );
			}
		} );

		columns.forEach( c => {
			if ( c.type === "numeric" ) {
				c.min = Math.min.apply( null, c.values );
				c.max = Math.max.apply( null, c.values );
			}
		} );
		return columns;
	}
};
