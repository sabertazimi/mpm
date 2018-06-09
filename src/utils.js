const gunzipMaybe = require('gunzip-maybe');
const tar = require('tar-stream');

function getFileName(entryName, virtualPath) {
    // remove prefix '/'
    entryName = entryName.replace(/^\/+/, '');

    for (let i = 0; i < virtualPath; ++i) {
        let index = entryName.indexOf('/');

        if (index == -1) {
            return null;
        }

        entryName = entryName.substr(index + 1);
    }

    return entryName;
}

/**
 * @param  {Buffer} buffer archive buffer
 */
async function readFileFromArchive(fileName, buffer, { virtualPath = 0 } = {}) {
    return new Promise((resolve, rejects) => {
        const extractor = tar.extract();

        extractor.on('entry', (header, stream, next) => {
            if (getFileName(header.name, virtualPath) === fileName) {
                const buffers = [];
                stream.on('data', data => buffers.push(data));
                stream.on('error', error => rejects(error));
                stream.on('end', () => resolve(Buffer.concat(buffers)));
            } else {
                stream.on('end', () => next());
            }

            stream.resume();
        });

        extractor.on('error', error => rejects(error));
        extractor.on('finish', () => rejects(new Error(`Couldn't find "${fileName}" inside the archive`)));

        const gunzipper = gunzipMaybe();
        gunzipper.pipe(extractor);
        gunzipper.on('error', error => rejects(error));
        gunzipper.write(buffer);
        gunzipper.end();
    });
}

async function readPackageJsonFromArchive(packageBuffer) {
    return await readFileFromArchive('package.json', packageBuffer, { virtualPath: 1 });
}

module.exports = {
    readFileFromArchive,
    readPackageJsonFromArchive
};