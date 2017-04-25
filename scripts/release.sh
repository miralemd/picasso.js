#!/bin/bash
set -e

## verify clean working index
if [ -n "$(git status --porcelain)" ]; then
  echo "There are changes in the current working directory - stash, clean or commit the changes then try again."
  exit 1;
fi

P_VERSION="$(cat package.json | grep version\": | sed 's/.*"\(.*\)\".*/\1/g')"
VERSION=$1

if [[ -z $1 ]]; then
  VERSION=$P_VERSION
fi

## check if version tag exists
if git rev-list -n 1 v$VERSION >/dev/null 2>&1 ; then
  echo "Oops! "v$VERSION" has already been released"
  exit 1;
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
# echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $VERSION ..."

  ## validate
  echo "  Validating ..."
  npm -s run lint
  npm -s run test

  ## set version in picasso.js/package.json
  sed --in-place=".tmp" -e "s/^\(  \"version\": \).*/\1\"$VERSION\",/g" package.json
  rm package.json.tmp

  ## update version in plugins
  for dir in plugins/*/ ; do
    sed --in-place=".tmp" -e "s/^\(  \"version\": \).*/\1\"$VERSION\",/g" $dir/package.json
    rm $dir/package.json.tmp
  done;

  ## build all
  echo "  Building ..."
  rm -rf ../dist
  ./scripts/build-all.sh

  ## commit and tag
  git commit -am "v"$VERSION""
  git tag -a "v"$VERSION"" -m "v"$VERSION""

  ## push
  git push && git push origin refs/tags/v"$VERSION"

  ## publish
  ./scripts/publish.sh

fi
