const transformRegEx = /(translate|scale|rotate|matrix)\((.+?)\)/g;

function parseTransform( transform ) {
	let m,
		commands = [];
	while ( ( m = transformRegEx.exec( transform ) ) !== null ) {
		let argsStr = m[2].trim();
		let args = argsStr.indexOf( "," ) === -1 ? argsStr.split( " " ) : argsStr.split( "," );

		commands.push( {
			cmd: m[1],
			args: args.filter( a => a.trim().length > 0 ).map( a => Number( a ) )
		} );
	}

	return commands;
}

function resolveRotateCmd( g, transform ) {
	let radians = transform.args[0] * ( Math.PI / 180 );

	if ( transform.args.length > 1 ) {
		let x = transform.args[1];
		let y = transform.args[2];
		g.translate( x, y );
		g.rotate( radians );
		g.translate( -x, -y );
	} else {
		g.rotate( radians );
	}
}

function resolveScaleCmd( g, transform ) {
	let x = transform.args[0];
	let y = isNaN( transform.args[1] ) ? transform.args[0] : transform.args[1];
	g.scale( x, y );
}

function resolveTranslateCmd( g, transform ) {
	let x = transform.args[0];
	let y = isNaN( transform.args[1] ) ? 0 : transform.args[1];
	g.translate( x, y );
}

function resolveMatrixCmd( g, transform ) {
	g.transform( ...transform.args );
}

export function resolveTransform( t, g ) {
	const transforms = parseTransform( t );

	transforms.forEach( transform => {
		if ( transform.cmd === "rotate" ) {
			resolveRotateCmd( g, transform );
		} else if ( transform.cmd === "scale" ) {
			resolveScaleCmd( g, transform );
		} else if ( transform.cmd === "matrix" ) {
			resolveMatrixCmd( g, transform );
		} else if ( transform.cmd === "translate" ) {
			resolveTranslateCmd( g, transform );
		}

	} );
}
