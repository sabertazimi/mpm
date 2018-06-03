const fs = require('fs-extra');
const fetch = require('node-fetch');
const semver = require('semver');

async function fetchPackage({ name, reference }){
    if ([`/`, `./`, `../`].some(prefix => reference.startsWith(prefix))) {
        return await fs.readFile(reference);
    }

    if (semver.valid(reference)) {
        return await fetchPackage({
            name,
            reference: `https://registry.npm.taobao.org/${name}/-/${name}-${reference}.tgz`
        });
    }

    let response =  await fetch(reference);

    if (!response.ok) {
        throw new Error(`Couldn't fetch package "${reference}"`);
    }

    return await response.buffer();
}
