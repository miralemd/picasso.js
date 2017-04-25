## temporarily set private flag to true
sed --in-place=".tmp" 's/^\(  "private": \).*/\1false,/g' package.json

## publish
npm publish

## revert flag
git reset --hard
