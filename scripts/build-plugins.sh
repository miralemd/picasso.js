#!/bin/bash
cd "$(dirname "$0")"
cwd=pwd
for dir in ./../plugins/*/
do
    dir=${dir%*/}
    dir=${dir##*/}

    echo Building ${dir}
    cd ../plugins/${dir}
    yarn
    npm -s run build
    npm -s run build:debug
    cd "${cwd}"
done
