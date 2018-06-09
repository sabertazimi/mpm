const resolve = require('path').resolve;
const util = require('util');

const log = require('log4js').getLogger();
log.level = 'debug';

const Mpm = require('./mpm.js');
const mpm = new Mpm();

const cwd = process.argv[2] || process.cwd();
const packageJson = require(resolve(cwd, 'package.json'));

packageJson.dependencies = Object.keys(packageJson.dependencies || {}).map(name => {
    return {
        name,
        reference: packageJson.dependencies[name]
    };
});

// mpm.getPackageDependencyTree(packageJson).then(tree => {
//     log.debug(util.inspect(tree, { depth: Infinity }));
// }).catch(error => {
//     log.error(error.message);
// });

mpm.linkPackages(packageJson, `${process.cwd()}/temp`).catch(error => {
    log.error(error.message);
});
