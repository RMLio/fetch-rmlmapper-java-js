const assert = require('assert');
const downloadRmlmapper = require('./download-rmlmapper');

describe('DownloadRMLMapper', function () {
    describe('#_getMetadata()', function () {
        it('should get metadata of latest', async function () {
            assert.ok(await downloadRmlmapper.getMetadata());
        });
        it('should get metadata of 5.0.0', async function () {
            assert.equal((await downloadRmlmapper.getMetadata('5.0.0')).tag_name, 'v5.0.0');
        });
        it('should not get metadata of "ImNotReal"', async function () {
            try {
                await downloadRmlmapper.getMetadata('ImNotReal')
            } catch (error) {
                assert.throws(() => { throw new Error(error.message) }, new Error('Version ImNotReal is not found.'));
            }
        });
    });
});
