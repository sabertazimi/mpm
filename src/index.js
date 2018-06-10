#!/usr/bin/env node

const resolve = require('path').resolve;
const util = require('util');

const log = require('log4js').getLogger();
const program = require('commander');
log.level = 'debug';

const mpm = require('./mpm.js');

program
    .version('0.1.0', '-v, --version');

program
    .command('install [package]')
    .alias('i')
    .description('Install dependencies')
    .option('')
    .action(function (package, option) {
        if (!package) {
            const cwd = process.cwd();
            const packageJson = require(resolve(cwd, 'package.json'));

            packageJson.dependencies = Object.keys(packageJson.dependencies || {}).map(name => {
                return {
                    name,
                    reference: packageJson.dependencies[name]
                };
            });

            mpm.linkPackages(packageJson, `${cwd}/temp`).catch(error => {
                log.error(error.message);
            });
        }
    });

program.parse(process.argv);
