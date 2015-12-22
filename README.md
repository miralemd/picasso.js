# picasso.js
A charting library streamlined for building visualizations for the Qlik Sense Analytics platform.

## How to build
1. Ensure that [NodeJS](http://nodejs.org/) is installed
2. From the repo folder execute the following:
```
npm install
npm run build
```

This will generate a UMD in `/dist/index.js`

To watch for changes and regenerate the package run `npm run build:watch`

## How to run tests
To be able to run the tests, clone the `after-work.js` repo into a folder:
```
git clone https://github.com/qlik-trial/after-work.js
```
Install its dependencies and build it:
```
npm install
npm run build
```
Link it globally:
```
npm link
```
Back in the `picasso` repo run the following to execute the tests:
```
npm run test
```
To rerun the tests on changes:
```
npm run test:watch
```
To generate unit test coverage information:
```
npm run test:coverage
```

## How to use
```
See the [Documentation and examples](docs/usage.md)
```
