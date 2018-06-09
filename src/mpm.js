'use strict'

const fs = require('fs-extra');
const fetch = require('node-fetch');
const semver = require('semver');
const REGISTRY_URL = 'https://registry.npm.taobao.org';

const readPackageJsonFromArchive = require('./utils.js').readPackageJsonFromArchive;

class Mpm {
  constructor(config) {
    this.config = config || {};
  }

  async getPinnedReference({ name, reference }) {
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

  async fetchPackage({ name, reference }) {
    if ([`/`, `./`, `../`].some(prefix => reference.startsWith(prefix))) {
      return await fs.readFile(reference);
    }

    if (semver.valid(reference)) {
      return await this.fetchPackage({
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

  async getPackageDependencies({ name, reference }) {
    const packageBuffer = await this.fetchPackage({ name, reference });
    const packageJson = JSON.parse(await readPackageJsonFromArchive(packageBuffer));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).map((name) => {
        return { name, reference: dependencies[name] };
      }),
      devDependencies: Object.keys(devDependencies).map((name) => {
        return { name, reference: devDependencies[name] };
      })
    };
  }
}

module.exports = Mpm;
