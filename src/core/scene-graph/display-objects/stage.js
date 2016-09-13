import Container from "./container";

export default class Stage extends Container {
	constructor() {
		super();
		this._stage = this;
	}
}

export function create() {
	return new Stage();
}
