#!/bin/bash
cd "$(dirname "$0")"
cd .. && yarn && npm -s run build && npm -s run build:dev && cd scripts
cd ../docs && yarn && npm run docs && cd ../scripts
cd ../plugins/hammer && yarn && npm -s run build && npm -s run build:dev && cd ../../scripts
cd ../plugins/q && yarn && npm -s run build && npm -s run build:dev && cd ../../scripts
