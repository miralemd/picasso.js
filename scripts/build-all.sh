#!/bin/bash
cd "$(dirname "$0")"
cd .. && npm i && npm -s run build && npm -s run build:dev && cd scripts
cd ../docs && npm i && npm run docs && cd ../scripts
cd ../plugins/hammer && npm i && npm -s run build && npm -s run build:dev && cd ../../scripts
cd ../plugins/q && npm i && npm -s run build && npm -s run build:dev && cd ../../scripts
