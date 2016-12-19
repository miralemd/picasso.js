This script utilizes JSDOC-JSON output & Handlebars to compile Documentation into Markdown files. Here's a short description of how to use it and how it works:

## Please note
I'll be using the name "template" here for all registered partials in the "templates"-folder. This may be confusing for people that are used to Handlebars, as they call it "partials".

## How to use it
* Modify files in docs/src/input
* Modifiy templates (if you wish) in docs/src/templates
* Run `npm run docs`
* View the output in docs/output

## Examples
To renderer jsdoc data from a specific file, use `{{>magic ctx='file.path.separated.by.dots'}}`. All actual dots in the file path are replaced with dashes, -, which means a file would look like this: `{{>magic ctx='core.data.index-js'}}`

If you want to renderer a specific function, you can place dots after the filename, as so: `{{>magic ctx='core.data.index-js.getDataFunc'}}`.

The `{{>magic }}` template automatically detects if it's a file, factory, function, class or typedef (so far). If you want to manually specify a factory function, you can use the `{{>function }}` shorthand to not render it's children. All available templates can be found in the `docs/src/templates`-folder.

When using `{{>function }}`, `{{>class }}` or *any* other partial except `{{>magic }}`, you should specify the context directly without commas, like this: `{{>function my.file-js.function}}`, please note the difference between `{{>magic ctx='my.file-js.function'}}`.

This is to make it easier for the magic resolution to debug whenever a file changes data or name.

## Parameter overriding
In some cases you may want to override parameters. For example, when using `export default function myFunction()`, the JSDOC will read it's path as `my.file-js.module-exports`, rather than it's real name.
In that scenario, you might want to override the `name` parameter to "myFunction", like so: `{{>function my.file-js.module-exports name='myFunction'}}`.

## How it works
`npm run docs` in root:
* `cd docs && npm run docs`
* JSDOC runs with JSDOC-JSON template, creates the file docs/src/docs.json
* node gen.js is run which:
* Parses the jsdoc.json file into a tree representing the file structure of the repo, with a few modifications
* Sets up some helpers with handlebars (check list below)
* Registers all templates in docs/src/templates as handlebars partials with their respective name
* Removes the docs/output folder
* Uses the docs/src/input-folder as source, compiles all files with the re-mapped JSDOC tree
* Output all compiled files to docs/output-folder

## Templates (partials)
* Bool `{{>bool my.variable}}`, will print 'Yes' for a truthy value and 'No' for a falsey value.
* Class `{{>class my.file-js.myclass}}`, shorthand for `function` template, to work with magic template resolution.
* Examples `{{>examples my.file-js.myfunction.examples}}`, prints all examples with JavaScript Code tag to enable highlighting on supported markdown compilers.
* Factory `{{>factory my.file-js.myfactory}}`, prints a function and all of it's child functions.

## Helpers
* All helpers from `assemble/handlebars-helpers`, list here: https://github.com/assemble/handlebars-helpers
*

## Advanced
You can view the output of the JSDOC in `src/docs.json`, and if you want to see the jsdoc data converted to a tree by filepaths that's used by the converter, you can uncomment the second to last line `fs.writeFileSync('jsdoc-restruct.json', JSON.stringify(jsdoc));` in `gen.js`
