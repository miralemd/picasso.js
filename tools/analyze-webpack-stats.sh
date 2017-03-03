#!/bin/bash
cd "$(dirname "$0")"
cd analyze-webpack-stats && yarn && mkdir -p dist && rm -f dist/stats.json && cd ..
cd .. && npm -s run build -- --json > tools/analyze-webpack-stats/dist/stats.json && cd tools
cd analyze-webpack-stats && yarn && npm -s run electrify -- dist/stats.json > dist/stats.html
echo "Open the following path in your browser"
echo "file://$(pwd -P)/dist/stats.html"
