/*
 * grunt-premailer
 * https://github.com/dwightjack/grunt-premailer
 *
 * Copyright (c) 2013-2016 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function gruntPremailer(grunt) {

    var dargs = require('dargs'),
        path = require('path'),
        fs = require('fs'),
        async = require('async'),
        isUtf8 = require('is-utf8'),
        _ = require('lodash'),
        warnLevels;

    warnLevels = {
        none: 0,
        safe: 1,
        poor: 2,
        risky: 3
    };

    grunt.registerMultiTask('premailer', 'Grunt wrapper task for premailer', function taskRegistration() {
        // Merge task-specific and/or target-specific options with these defaults.
        var args = {},
            done = this.async(),
            options = this.options({
                baseUrl: null,
                bundleExec: false,
                queryString: '',
                css: [],
                removeClasses: false,
                removeScripts: false,
                removeComments: false,
                preserveStyles: false,
                preserveStyleAttribute: false,
                lineLength: 65,
                ioException: false,
                verbose: false,
                mode: 'html',
                warnLevel: 'safe',
                removeIds: false,
                replaceHtmlEntities: false,
                escapeUrlAttributes: true
            }),
            keys,
            cmd;

        keys = Object.keys(options);

        // Remove bundleExec from arguments
        keys.splice(keys.indexOf('bundleExec'), 1);

        //clean-up falsy options and parse template-like values
        keys.forEach(function keyIterator(key) {
            var val = options[key];

            if (typeof val === 'string') {
                val = grunt.template.process(val);
            }
            //warn level could be 0, preserve it
            if ((typeof val === 'object' && !_.isEmpty(val)) || (typeof val !== 'object' && !!val)) {
                args[key] = val;
            }
        });

        //convert warn level
        args.warnLevel = _.has(warnLevels, args.warnLevel) ? warnLevels[args.warnLevel] : 0;

        //also manage properly the css option
        if (_.has(args, 'css') && Array.isArray(args.css)) {
            args.css = _(args.css)
                        .map(function mapFn(csspath) {
                            return grunt.config.process(csspath);
                        })
                        .reduce(function reduceFn(paths, csspath) {
                            var expanded = grunt.file.expand({
                                filter: function expandFilterFn(src) {
                                    return grunt.file.isFile(src) && (path.extname(src) === '.css');
                                }
                            }, csspath);

                            return paths.concat(expanded);
                        }, [])
                        .valueOf()
                        .join(',');
        }

        // Arguments
        args = dargs(args);

        args.unshift(path.join(__dirname, '..', 'lib', 'premailer.rb'));


        // Command to run
        if (options.bundleExec) {
            cmd = 'bundle';

            args.unshift('exec', 'ruby');
        } else {
            cmd = 'ruby' + (process.platform === 'win32' ? '.exe' : '');
        }


        // Asynchronously iterate over all specified file groups.
        async.eachLimit(this.files, 10, function asyncIterator(f, next) {
            // Concat specified files.
            var srcFile,
                batchArgs,
                premailer,
                tmpFile;

            srcFile = f.src.filter(function filterFn(sFile) {
                return grunt.file.isFile(sFile);
            }).shift();

            if (!srcFile) {
                //skip!
                grunt.log.writeln('Input file not found');
                next(null);
            }

            if (!isUtf8(fs.readFileSync(srcFile))) {
                //skip!
                grunt.log.writeln('Input file must have utf8 encoding');
                next(null);
            }

            if (srcFile === f.dest) {
                //generate a temp dest file
                tmpFile = path.join(path.dirname(f.dest), _.uniqueId('.premailer-') + '.tmp');
                grunt.file.write(tmpFile, '');
                grunt.verbose.writeln('Creating temporary file ' + tmpFile);
            } else {
                grunt.file.write(f.dest, ''); // Create empty destination file
            }

            // Premailer expects absolute paths
            batchArgs = args.concat(['--file-in', path.resolve(srcFile.toString()), '--file-out', path.resolve((tmpFile || f.dest).toString())]);

            premailer = grunt.util.spawn({
                cmd: cmd,
                args: batchArgs
            }, function premailerCb(err/*, result, code*/) {
                if (err) {
                    grunt.fail.fatal(err);
                }
                if (tmpFile) {
                    grunt.file.copy(tmpFile, f.dest);
                    grunt.file.delete(tmpFile);
                    grunt.verbose.writeln('Removing temporary file ' + tmpFile);

                }

                next(err);
            });

            premailer.stdout.pipe( process.stdout );
            premailer.stderr.pipe( process.stderr );
        }, done);
    });

};
