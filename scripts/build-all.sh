#!/bin/bash
cd "$(dirname "$0")"
cd .. && yarn && npm -s run build && npm -s run build:debug && cd scripts
cd ../plugins/hammer && yarn && npm -s run build && npm -s run build:debug
