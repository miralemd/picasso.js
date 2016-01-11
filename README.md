# picasso.js
A charting library streamlined for building visualizations for the Qlik Sense Analytics platform.

## How to build
1. Make sure your Node and npm config is set up to consume our [private packages](http://confluence.qliktech.com/display/CL/Node+environment)
2. From the repo folder execute the following:

```
$ npm install
$ npm run build
```

This will generate a UMD package in `/dist/index.js`.

To watch for changes and regenerate the package run `npm run build:watch`.

## How to run tests

```
$ npm run test
```

To rerun the tests on changes:

```
$ npm run test:watch
```

To generate unit test coverage information:

```
$ npm run test:coverage
```

## How to use

See the [Documentation and examples](docs/usage.md).
