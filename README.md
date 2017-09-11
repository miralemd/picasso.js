# picasso.js

A charting library streamlined for building visualizations for the Qlik Sense Analytics platform.

## Status

[![Build status](https://circleci.com/gh/qlik-trial/picasso.js.svg?style=shield&circle-token=b2d43b9cac73c7cad1637e2c2e435d7786b3ae8f)](https://circleci.com/gh/qlik-trial/picasso.js)

## Developing

### Building

1. Install dependencies:

    ```sh
    $ npm install
    ```

2. Run the build script:

    ```sh
    $ ./scripts/build-all.sh
    ```

    This will generate UMD packages for
    
    - the main build under `/dist`
    - each plugin under `/plugins/*/dist`

### Running tests

```sh
$ npm run test
```

To rerun the tests on changes:

```sh
$ npm run test:watch
```

To generate unit test coverage information:

```sh
$ npm run test:coverage
```

## Usage

* See [examples](examples/).
* Use the [Documentation](http://rd-picasso.rdlund.qliktech.com/picasso/master/docs/dist/) as a reference, you can also [view them on github](docs/dist/).
* Try out live examples on [Picasso Sandbox](http://rd-picasso.rdlund.qliktech.com).
