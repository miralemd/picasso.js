export class economic {
	constructor( obj, composer ) {
		this.element = composer.element;

		this.settings = obj.settings;
		this.data = composer.data;
		this.obj = obj;

		// Setup scales
		this.x = composer.scales[this.settings.x.scale];
		this.y = composer.scales[this.settings.y.scale];
	}

	onData() {
		this.boxes = [];

		this.data.dataPages().then( ( pages ) => {

			pages.forEach( ( page, i ) => {
				const x = this.x ? this.data.fromSource( this.x.source, i ) : null,
					min = this.settings.min ? this.data.fromSource( this.settings.min.source, i ) : null,
					max = this.settings.max ? this.data.fromSource( this.settings.max.source, i ) : null,
					start = this.settings.start ? this.data.fromSource( this.settings.start.source, i ) : null,
					end = this.settings.end ? this.data.fromSource( this.settings.end.source, i ) : null,
					med = this.settings.med ? this.data.fromSource( this.settings.med.source, i ) : null;

				this.data.fromSource( this.obj.data.source, i ).forEach( ( value, row ) => {
					this.boxes.push( {
						x: x ? ( this.x.scale.get( row ) ) : 0.5,
						min: min ? ( this.y.toValue( min, row ) ) : null,
						max: max ? ( this.y.toValue( max, row ) ) : null,
						start: start ? ( this.y.toValue( start, row ) ) : 0,
						end: end ? ( this.y.toValue( end, row ) ) : null,
						med: med ? ( this.y.toValue( med, row ) ) : null
					} );
				} );
			}, this );

			this.resize();
		} ).catch( () => {
			this.resize();
		} );
	}

	render( boxes ) {
		return boxes;
	}

	resize() {
		this.renderer.rect.width = this.element.clientWidth;
		this.renderer.rect.height = this.element.clientHeight;

		this.render( this.boxes );
	}

	remap( input, output ) {
		this.settings[output] = this.settings[input];
		delete this.settings[input];
	}
}
