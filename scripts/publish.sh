## temporarily set private flag to true
sed -i .tmp 's/^\(  "private": \).*/\1false,/g' package.json

## publish
npm publish

## revert flag
git reset --hard
