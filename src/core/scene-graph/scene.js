import { create } from "./display-objects";

function traverse( items, parent ) {
	items.forEach( s => {
		let obj = create( s.type, s );
		if ( obj ) {
			obj.set( s );
			obj.type = s.type;
			parent.addChild( obj );
		}
	} );
}

export function scene( items, stage ) {
	if ( !stage ) {
		stage = create( "stage" );
	}

	traverse( items, stage );

	return stage;
}
