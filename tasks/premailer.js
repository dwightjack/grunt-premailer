/*
 * grunt-premailer
 * https://github.com/dwightjack/grunt-premailer
 *
 * Copyright (c) 2013 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var dargs = require('dargs'),
        path = require('path'),
        async = require('async'),
        _ = require('lodash');

    grunt.registerMultiTask('premailer', 'Grunt wrapper task for premailer', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var args = {},
            done = this.async(),
            series = [],
            options = this.options({
                baseUrl: null,
                queryString: '',
                css: [],
                removeClasses: false,
                removeComments: false,
                preserveStyles: false,
                lineLength: 65,
                ioException: false,
                verbose: false,
                mode: 'html'
            });

        //clean-up falsy options and parse template-like values
        Object.keys(options).forEach(function(key) {
            var val = options[key];

            if (typeof val === 'string') {
                val = grunt.template.process(val);
            }
            if ((typeof val === 'object' && !_.isEmpty(val)) || (typeof val !== 'object' && !! val)) {
                args[key] = val;
            }
        });

        //also manage properly the css option
        if (_.has(args, 'css') && Array.isArray(args.css)) {
            args.css = _(args.css)
                        .map(function (csspath) {
                            return grunt.config.process(csspath);
                        })
                        .reduce(function (paths, csspath) {
                            var expanded = grunt.file.expand({
                                filter: function (src) {
                                    return grunt.file.isFile(src) && (path.extname(src) === '.css');
                                }
                            }, csspath);

                            return paths.concat(expanded);
                        }, [])
                        .valueOf()
                        .join(',');
        }

        args = dargs(args);

        args.unshift(path.join(__dirname, '..', 'lib', 'premailer.rb'));

        // Asynchronously iterate over all specified file groups.
        async.each(this.files, function(f, next) {
            // Concat specified files.
            var src,
                tmpFile,
                batchArgs,
                premailer;

            src = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            })
            .map(function(filepath) {
                return grunt.file.read(filepath);
            }).join("\n");

            if (src.length === 0) {
                grunt.log.warn('Nothing to parse');
                next();
            }

            //generate a temp file with concatened source
            tmpFile = path.join(path.dirname(f.dest), _.uniqueId('_tmp_premailer_') + '.html');
            grunt.file.write(tmpFile, src);

            batchArgs = args.concat(['--file-in', tmpFile, '--file-out', f.dest]);

            premailer = grunt.util.spawn({
                cmd: 'ruby' + (process.platform === 'win32' ? '.exe' : ''),
                args: batchArgs
            }, function(err, result, code) {
                if (err) {
                    grunt.fail.fatal(err);
                } else {
                    grunt.file.delete(tmpFile, {force: true});
                }
                next(err);
            });

            premailer.stdout.pipe( process.stdout );
            premailer.stderr.pipe( process.stderr );
        }, done);
    });

};
