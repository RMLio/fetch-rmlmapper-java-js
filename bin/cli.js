#!/usr/bin/env node

/**
 * author: Pieter Heyvaert (pheyvaer.heyvaert@ugent.be)
 * Ghent University - imec - IDLab
 */

const { download } = require('../lib/download-rmlmapper');
const logger = require('../lib/logger');
const { program } = require('commander');
const pkg = require('../package.json');
const fs = require('fs');
const path = require('path');

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .option('-g, --githubVersion [version]', 'optional version you want to download, as published on Github (default: "latest")')
  .option('-f, --filename [rmlmapper.jar]', 'optional filename of the downloaded jar (via relative to the CWD or via absolute path) (default: name of the published asset of the release)')
  .showHelpAfterError();

// Get arguments from CLI.
program.parse();
const options = program.opts();

let version = options.githubVersion || null;
logger.debug(version)
if (version?.startsWith('v')) {
  version = version.slice(1);
}
logger.debug(`Using version ${version}`)
let filename = options.filename || null;

if (version) {
  logger.info(`Downloading the RMLMapper v${version}...`);
} else {
  logger.info('Downloading the latest version of the RMLMapper...');
}

download(filename, version, process.cwd())
  .then(({ tagName, filePath }) => {
    fs.writeFileSync(path.resolve(process.cwd(), 'rmlmapper-version.txt'), tagName, 'utf8')
    logger.info(`Download complete. The RMLMapper is available at ${filePath}`);
  })
  .catch(e => {
    logger.error(e);
  });
