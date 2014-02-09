'use strict';

var exec = require('child_process').exec;
var chalk = require('chalk');
var semver = require('semver');
var version = '1.8.0';

exec('gem list premailer -a', function (error, stdout, stderr) {
    if (error !== null) {
        console.log(chalk.red('ERROR: Unable to check for Premailer gem version...'));
    } else {
        var premailer = stdout.toString().split('\n').filter(function (l) {
            return (/^premailer\s/).test(l);
        }).pop();

        if (premailer) {
            var versionMatch = premailer
                                .replace(/[^\d\.,]/g, '')
                                .split(',')
                                .some(function (v) {
                                    return semver.gte(v, version);
                                });
            if (versionMatch) {
                console.log(chalk.green('Premailer v' + version + ' or greater found on the system.'));
            } else {
                console.log(chalk.red('ERROR: You need at least Premailer v' + version + '. Issue "gem update premailer" to update installed version'));
            }
        } else {
            //installing premailer
            console.log(chalk.red('ERROR: Premailer gem not installed. Issue "gem install premailer" to install it'));
        }
    }
});