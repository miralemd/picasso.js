# picasso.js
A charting library streamlined for building visualizations for the Qlik Sense Analytics platform.

## Status

[![Build status](https://circleci.com/gh/qlik-trial/picasso.js.svg?style=shield&circle-token=b2d43b9cac73c7cad1637e2c2e435d7786b3ae8f)](https://circleci.com/gh/qlik-trial/picasso.js)

## How to build
1. Make sure your Node and npm config is set up to consume our [private packages](http://confluence.qliktech.com/display/CL/Node+environment)
2. From the repo folder execute the following:

```
$ npm install
$ npm run build
```

This will generate UMD packages for `picasso` and `picasso-angular` in the `/dist` folder.

To watch for changes and regenerate the packages run `npm run build:watch`.

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
