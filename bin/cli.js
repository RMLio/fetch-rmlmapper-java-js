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

logger.info('Downloading the RMLMapper...');
download(process.cwd())
  .then(() => {
    logger.info('Download complete. The RMLMapper is available at ' + process.cwd());
  })
  .catch(e => {
    logger.error(e);
  });
