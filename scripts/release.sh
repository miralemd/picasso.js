#!/bin/bash
set -e

## verify clean working index
if [ -n "$(git status --porcelain)" ]; then
  echo "There are changes in the current working directory - stash, clean or commit the changes then try again."
  exit 1;
fi

P_VERSION="$(cat package.json | grep version\": | sed 's/.*"\(.*\)\".*/\1/g')"
DATE=`date +%Y-%m-%d`

# parse arguments
while getopts ":v:b" opt; do
  case ${opt} in
    v ) # version
      VERSION=$OPTARG
      ;;
    b ) # indicates breaking release
      BREAKING="[BREAKING]"
      ;;
    \? ) echo "Usage: release.sh [-v <major.minor.patch>] [-b]"
      ;;
    : )
      echo "Invalid option: -$OPTARG requires a valid version" 1>&2
      exit 1
      ;;
  esac
done

## store changelog release template
TEMPLATE="$(cat CHANGELOG.md | grep {{VERSION}})"

## if version is not set, use version from package.json
if [[ -z $VERSION ]]; then
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
  sed -i.tmp "s/^\(  \"version\": \).*/\1\"$VERSION\",/g" package.json
  rm package.json.tmp

  ## update version in plugins
  for dir in plugins/*/ ; do
    sed -i.tmp -e "s/^\(  \"version\": \).*/\1\"$VERSION\",/g" $dir/package.json
    rm $dir/package.json.tmp
  done;

  ## generate about.js
  npm -s run version

  ## update CHANGELOG.md
  ## append [BREAKING] flag
  if [[ -n $BREAKING ]]; then
    sed -i.tmp "/{{VERSION}}/ s/$/ $BREAKING/" CHANGELOG.md
  fi

  ## replace template variables
  sed -i.tmp "s/{{VERSION}}/$VERSION/" CHANGELOG.md
  sed -i.tmp "s/{{DATE}}/$DATE/" CHANGELOG.md

  ## append original template (for next release)
  sed -i.tmp "s/# Changelog/&\\
\\
$TEMPLATE/" CHANGELOG.md

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
