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
      _ = require('lodash');

  grunt.registerMultiTask('premailer', 'Grunt wrapper task for premailer', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var args = {},
        done = this.async(),
        options = this.options({
        baseUrl: null,
        queryString: '',
        css: [],
        removeClasses: false,
        lineLength: 65,
        ioException: false,
        verbose: false,
        mode: 'html'
    });

    //clean-up falsy options and parse template-like values
    Object.keys(options).forEach(function (key) {
      var val = options[key];

      if (typeof val === 'string') {
          val = grunt.template.process(val);
      }
      if ((typeof val === 'object' && !_.isEmpty(val)) || (typeof val !== 'object' && !!val)) {
        args[key] = val;
      }
    });

    //also manage properly the css option
    if (_.has(args, 'css') && Array.isArray(args.css)) {
      args.css = args.css.join(',');
    }


    args = dargs(args);

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      })
      .map(function (filepath) {
        return grunt.file.read(filepath);
      }).join("\n");

      if (src.length === 0) {
        grunt.fail.fatal('Nothing to parse');
      }

      var premailer = grunt.util.spawn({
          cmd: 'premailer' + (process.platform === 'win32' ? '.bat' : ''),
          args: args
      }, function( err, result, code ) {
        if ( err ) {
          grunt.fail.fatal(err);
        } else {
          grunt.file.write(f.dest, result.toString());
        }

        done(!err);
      });


      premailer.stderr.pipe(process.stderr);

      premailer.stdin.write(src);
      premailer.stdin.end();
    });
  });

};
