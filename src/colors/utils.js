export default class ColourUtils {

	linearGradient(linearScale) {

		let inputDomain = linearScale.inputDomain;

		let cssColors = inputDomain.map((d) => {
			return linearScale.get(d);
		}).join();

		return `linear-gradient(to right, ${cssColors})`;
	}
}
