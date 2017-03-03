#!/bin/bash
cd "$(dirname "$0")"
cd ../docs && yarn && npm -s run docs && cd ../tools
cd generate-html-docs && yarn && npm -s run generate
echo "Open the following path in your browser:"
echo "file://$(pwd -P)/dist/index.html"
