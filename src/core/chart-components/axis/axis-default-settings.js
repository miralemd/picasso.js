export function discreteDefaultSettings() {
	return {
		dock: "bottom",
		labels: {
			show: true,
			tilted: false,
			style: {
				fontFamily: "Arial",
				fontSize: "13px",
				fill: "#999"
			},
			padding: 6,
			layered: false // TODO support auto, true and false?
		},
		line: {
			show: true,
			style: {
				strokeWidth: 1,
				stroke: "#999"
			}
		},
		ticks: {
			show: true,
			padding: 0,
			tickSize: 4,
			style: {
				stroke: "#999",
				strokeWidth: 1
			}
		}
	};
}

export function continuousDefaultSettings() {
	return {
		dock: "left",
		labels: {
			show: true,
			tilted: false,
			style: {
				fontFamily: "Arial",
				fontSize: "13px",
				fill: "#999"
			},
			padding: 4,
			layered: false
		},
		line: {
			show: true,
			style: {
				strokeWidth: 1,
				stroke: "#999"
			}
		},
		ticks: {
			show: true,
			padding: 0,
			tickSize: 8,
			tight: false,
			forceBounds: false,
			// max: 0, // Set max value on axis, modifies domain end
			// min: 0, // Set min value on axis, modifies domain start
			// count: 10, // overrides auto
			// values: [0, 1, 2], // overrides count and auto
			style: {
				stroke: "#999",
				strokeWidth: 1
			}
		},
		minorTicks: {
			show: false,
			padding: 0,
			tickSize: 3,
			style: {
				stroke: "#999",
				strokeWidth: 1
			},
			count: 3
		}
	};
}
