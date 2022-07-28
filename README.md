# fetch-rmlmapper-java-js

Easily download the jar of a specific or latest version of the RMLMapper,
either via the command line interface or
directly from within your application.

## Usage

### CLI

- Install the tool: `npm i @rmlio/fetch-rmlmapper-java`.
- Execute the tool: `download-rmlmapper [options]`.
  - help is provided using `--help`, also seen below
- The eventually downloaded RMLMapper tag name will be stored in `rmlmapper-version.txt`, next to the jar.

```
Usage: @rmlio/fetch-rmlmapper-java [options]

Download the Java RMLMapper jar.

Options:
  -V, --version                   output the version number
  -g, --githubVersion [version]   optional version you want to download, as published on Github (default: "latest")
  -f, --filename [rmlmapper.jar]  optional filename of the downloaded jar (via relative to the CWD or via absolute path) (default: name of the published asset of the release)
  -h, --help                      display help for command
```

### Library

TODO, but at the moment you can have a look at `bin/cli.js`.

## License

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/) and released under the [MIT license](http://opensource.org/licenses/MIT).
