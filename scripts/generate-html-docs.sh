#!/bin/bash
cd "$(dirname "$0")"
cd ../docs && npm i && npm -s run docs && cd ../scripts
cd ../tools/generate-html-docs && npm i
if command -v babel-node >/dev/null 2>&1; then
    babel-node lib/index.js
else
    node lib/index.js
fi
echo "Open the following path in your browser:"
echo "file://$(pwd -P)/dist/index.html"
