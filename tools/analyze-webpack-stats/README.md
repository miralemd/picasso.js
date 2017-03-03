# Webpack module stats analyzer

This tool is using [Electrify](https://github.com/electrode-io/electrode-electrify) to display module file sizes in a sunburst chart.

## Usage

- Install with `npm install` or `yarn`
- Output stats from webpack with `npm run build -- --json > stats.json`, standing in the root directory.
- Run `npm run electrify -- ../../stats.json --open` to display stats in the browser.
