This script utilizes JSDOC-JSON output & Handlebars to compile Documentation into Markdown files. Here's a short description of how to use it and how it works:

## How to use it
* Modify files in docs/src/input
* Modifiy templates (if you wish) in docs/src/templates
* Run `npm run docs`
* View the output in docs/output

## Examples
To renderer jsdoc data from a specific file, use {{>magic file.path.separated.by.dots}}. All actual dots in the file path are replaced with dashes, -, which means a file would look like this: {{>magic core.data.index-js}}

If you want to renderer a specific function, you can place dots after the filename, as so: {{>magic core.data.index-js.getDataFunc}}.

The {{>magic }} template automatically detects if it's a file, factory, function, class or typedef (so far). If you want to manually specify a factory function, you can use the {{>function }} shorthand to not render it's children.

## How it works
`npm run docs` in root:
* `cd docs && npm run docs`
* JSDOC runs with JSDOC-JSON template, creates the file docs/src/docs.json
* node gen.js is run which:
* Parses the jsdoc.json file into a tree representing the file structure of the repo, with a few modifications
* Sets up some helpers with handlebars
* Registers all templates in docs/src/templates as separate templates with their respective name
* Removes the docs/output folder
* Uses the docs/src/input-folder as source, compiles all files with the re-mapped JSDOC tree
* Output all compiled files to docs/output-folder

## Advanced
You can view the output of the JSDOC in `src/docs.json`, and if you want to see the jsdoc data converted to a tree by filepaths that's used by the converter, you can uncomment the second to last line `fs.writeFileSync('jsdoc-restruct.json', JSON.stringify(jsdoc));` in `gen.js`
