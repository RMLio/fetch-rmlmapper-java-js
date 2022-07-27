#!/usr/bin/env node

/**
 * author: Pieter Heyvaert (pheyvaer.heyvaert@ugent.be)
 * Ghent University - imec - IDLab
 */

const { download } = require('../lib/download-rmlmapper');
const logger = require('../lib/logger');

// Get arguments from CLI.
const args = process.argv.slice(2);

// Check number of arguments.
if (args.length > 2) {
  logger.error(`Arguments: cli.js [version] [filename].
version: to specify with version you want to download (optional, default: "latest").
filename: to specify (via relative to the CWD or via absolute path) the filename of the downloaded jar (optional, default: name of the published asset of the release).`);
  process.exit(1);
} else {
  let version = null;
  let filename = null;
  if (args[0]) {
    version = args[0];
    if (version.startsWith('v')) {
      version = version.slice(1);
    }
  }
  if (args[1]) {
    filename = args[1];
  }

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
}
