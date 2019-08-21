/**
 * author: Pieter Heyvaert (pheyvaer.heyvaert@ugent.be)
 * Ghent University - imec - IDLab
 */

const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');

const RMLMAPPER_RELEASES = 'https://api.github.com/repos/rmlio/rmlmapper-java/releases';
const RMLMAPPER_LATEST = RMLMAPPER_RELEASES + '/latest';

function download(toFolderPath, version) {
  if (version) {
    return _downloadSpecificVersion(toFolderPath, version);
  } else {
    return _downloadLatestVersion(toFolderPath);
  }
}

function _downloadLatestVersion(toFolderPath) {
  return new Promise((resolve, reject) => {
    https.get(RMLMAPPER_LATEST, {
      headers: {'User-Agent': 'RMLMapper downloader'}
    }, (res) => {
      let json = '';

      res.on('data', (d) => {
        json += d;
      });

      res.on('end', async () => {
        json = JSON.parse(json);
        const url = _getDownloadUrlFromRelease(json);

        if (url) {
          const filePath = path.resolve(toFolderPath, 'rmlmapper-' + json.tag_name.substr(1) + '.jar');

          await _downloadToFile(url, filePath);
          resolve(json.tag_name);
        } else {
          reject('No jar was found for the latest release. Please contact the developers.');
        }
      });

    }).on('error', (e) => {
      reject(e);
    });
  });
}

function _downloadSpecificVersion(toFolderPath, version) {
  return new Promise((resolve, reject) => {
    https.get(RMLMAPPER_RELEASES, {
      headers: {'User-Agent': 'RMLMapper downloader'}
    }, (res) => {
      let json = '';

      res.on('data', (d) => {
        json += d;
      });

      res.on('end', async () => {
        json = JSON.parse(json);

        let i = 0;

        while (i < json.length && json[i].tag_name !== ('v' + version)) {
          i ++;
        }

        if (i < json.length) {
          const url = _getDownloadUrlFromRelease(json[i]);

          if (url) {
            const filePath = path.resolve(toFolderPath, 'rmlmapper-' + version + '.jar');

            await _downloadToFile(url, filePath);
            resolve();
          } else {
            reject('No jar was found for the latest release. Please contact the developers.');
          }
        } else {
          reject(`Version ${version} is not found.`);
        }
      });

    }).on('error', (e) => {
      reject(e);
    });
  });
}

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

function _getDownloadUrlFromRelease(release) {
  let i = 0;

  while (i < release.assets.length && release.assets[i].browser_download_url.indexOf('.jar') === -1) {
    i++
  }

  if (i < release.assets.length) {
    return release.assets[i].browser_download_url;
  } else {
    return null;
  }
}

module.exports = download;
