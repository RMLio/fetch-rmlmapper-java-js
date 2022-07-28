/**
 * author: Pieter Heyvaert (pieter.heyvaert@ugent.be)
 * Ghent University - imec - IDLab
 */

const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const RMLMAPPER_RELEASES = 'https://api.github.com/repos/rmlio/rmlmapper-java/releases';

/**
 * This method downloads the jar of the RMLMapper, of a specific tagName, in specific folder, using a specific fileName
 * @param {string} fileName The filename of the jar. Optional. Defaults to the name of the assets as originally published.
 * @param {string} version The version of the RMLMapper. Optional. Defaults to latest version.
 * @param {string} toFolderPath The path to which the jar needs to be downloaded. Optional. Defaults to the current working directory.
 * @returns {Promise<unknown>}
 */
async function download(fileName = null, version = null, toFolderPath = null) {
  let releaseMeta = await getMetadata(version);
  logger.debug(JSON.stringify(releaseMeta));
  return _downloadViaMetadata(releaseMeta, fileName, toFolderPath);
}

/**
 * This method fetches the metadata of a specific tagname
 * @param {string} version name of the tag of which to return the metadata URL
 * @returns 
 */
function getMetadata(version = null) {
  logger.debug(`Getting metadata of version "${version || 'latest'}"`)
  return new Promise((resolve, reject) => {
    https.get(RMLMAPPER_RELEASES, {
      headers: { 'User-Agent': 'RMLMapper downloader' }
    }, (res) => {
      logger.debug(`Got successful answer from ${RMLMAPPER_RELEASES}.`)
      let json = '';

      res.on('data', (d) => {
        json += d;
      });

      res.on('end', () => {
        json = JSON.parse(json);
        logger.debug(`Answer contains ${json.length} releases.`)

        let releaseMeta = json[0];
        if (version) {
          let i = 0;
          while (i < json.length && json[i].tag_name !== ('v' + version)) {
            i++;
          }

          if (i < json.length) {
            releaseMeta = json[i];
          } else {
            reject(new Error(`Version ${version} is not found.`));
          }
        }
        resolve(releaseMeta);
      });

    }).on('error', (e) => {
      logger.error('no valid release metadata found!');
      reject(e);
    });
  });
}

/**
 * This method downloads a jar via release metdata
 * @param {object} metadata The Github release metadata.
 * @param {string} fileName The filename of the jar. Optional. Defaults to the name of the assets as originally published.
 * @param {string} toFolderPath The path to which the jar needs to be downloaded. Optional. Defaults to the current working directory.
 * @returns {Promise<unknown>}
 * @private
 */
async function _downloadViaMetadata(metadata, fileName = null, toFolderPath = null) {
  const asset = _getJarAssetFromRelease(metadata);
  if (asset) {
    if (!fileName) {
      fileName = asset.name
    }
    logger.debug(`Using filename ${fileName} for asset ${asset.name}`)
    const filePath = path.resolve(process.cwd(), toFolderPath, fileName);
    logger.info(`Downloading the RMLMapper ${metadata.tag_name}...`);
    await _downloadToFile(asset.browser_download_url, filePath);
    logger.info(`The RMLMapper is available at ${filePath}.`);
    return { tagName: metadata.tag_name, filePath };
  } else {
    throw new Error('No jar was found for the latest release. Please contact the developers.');
  }
}

/**
 * This method download a url to a file.
 * @param url The url that needs to be downloaded.
 * @param filePath The path of the file.
 * @returns {Promise<unknown>} A promise that resolves when the file is downloaded or rejects when an error occurs.
 * @private
 */
function _downloadToFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, function (response) {
      response.pipe(file);

      response.on('end', resolve);
      response.on('error', reject);
    });
  });
}

/**
 * This method return the url of the jar of a release.
 * @param release An object with release information.
 * @returns {null|*} The url of the jar or null
 * @private
 */
function _getJarAssetFromRelease(release) {
  let i = 0;

  while (i < release.assets.length && release.assets[i].browser_download_url.indexOf('.jar') === -1) {
    i++
  }

  if (i < release.assets.length) {
    return release.assets[i];
  } else {
    return null;
  }
}

module.exports = {
  download,
  getMetadata
};
