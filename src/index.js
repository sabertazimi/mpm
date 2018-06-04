const fs = require('fs-extra');
const fetch = require('node-fetch');
const semver = require('semver');
const REGISTRY_URL = 'https://registry.npm.taobao.org';

async function getPinnedReference({ name, reference }) {
  if (semver.validRange(reference) && !semver.valid(reference)) {
    const response = await fetch(`${REGISTRY_URL}/${name}`);

    if (!response.ok) {
        throw new Error(`Couldn't fetch package "${name}"`);
    }

    const info = await response.json();
    const versions = Object.keys(info.versions);
    const maxSatisfying = semver.maxSatisfying(versions, reference);

    if (maxSatisfying === null) {
      throw new Error(
        `Couldn't find a version matching "${reference}" for package  "${name}"`
      );
    }

    reference = maxSatisfying;
  }

  return { name, reference };
}

async function fetchPackage({ name, reference }){
    if ([`/`, `./`, `../`].some(prefix => reference.startsWith(prefix))) {
        return await fs.readFile(reference);
    }

    if (semver.valid(reference)) {
        return await fetchPackage({
            name,
            reference: `${REGISTRY_URL}/${name}/-/${name}-${reference}.tgz`
        });
    }

    const response =  await fetch(reference);

    if (!response.ok) {
        throw new Error(`Couldn't fetch package "${reference}"`);
    }

    return await response.buffer();
}

fetchPackage({
    name: 'react',
    reference: '16.4.0'
}).then(buffer => console.log(buffer));
