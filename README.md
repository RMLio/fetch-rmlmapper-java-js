# fetch-rmlmapper-java-js

Easily download the jar of a specific or latest version of the RMLMapper,
either via the command line interface or
directly from within your application.

## Usage

### CLI

- Install the tool: `npm i @rmlio/fetch-rmlmapper-java`.
- Execute the tool: `download-rmlmapper [version] [filename]`.
  - `version`: to specify with version you want to download (default: "latest")
  - `filename`: to specify (via relative to the CWD or via absolute path) the filename of the downloaded jar
- The eventually downloaded RMLMapper tag name will be stored in `rmlmapper-version.txt`, next to the jar.

### Library

TODO, but at the moment you can have a look at `bin/cli.js`.

## License

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/) and released under the [MIT license](http://opensource.org/licenses/MIT).
