#!/usr/bin/env node

/**
 * author: Pieter Heyvaert (pheyvaer.heyvaert@ugent.be)
 * Ghent University - imec - IDLab
 */

const download = require('../index');
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

let version = null;

// Get arguments from CLI.
const args = process.argv.slice(2);

// Check number of arguments.
if (args.length > 1) {
  logger.error('Please provide no arguments to download the latest version or provide the version you want to download.');
  process.exit(1);
} else {
  if (args.length === 1) {
    version = args[0];

    if (version.startsWith('v')) {
      version = version.substr(1);
    }
  }

  if (version) {
    logger.info(`Downloading the RMLMapper v${version}...`);
  } else {
    logger.info('Downloading the latest version of the RMLMapper...');
  }

  download(process.cwd(), version)
    .then(() => {
      logger.info('Download complete. The RMLMapper is available at ' + process.cwd());
    })
    .catch(e => {
      logger.error(e);
    });
}
