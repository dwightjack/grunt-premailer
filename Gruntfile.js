/*
 * grunt-premailer
 * https://github.com/dwightjack/grunt-premailer
 *
 * Copyright (c) 2013 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    paths: {
        fixtures: 'test/fixtures'
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    premailer: {
      html: {
        options: {
        },
        files: {
          'tmp/email.html': ['<%= paths.fixtures %>/email.html'],
        },
      },
      multiple: {
        files: {
          'tmp/email.html': ['<%= paths.fixtures %>/email.html'],
          'tmp/email-2.html': ['<%= paths.fixtures %>/email-2.html']
        },
      },
      txt: {
        options: {
          mode: 'txt'
        },
        files: {
          'tmp/email.txt': ['<%= paths.fixtures %>/email.html'],
        },
      },
      full: {
        options: {
          baseUrl: 'http://www.mydomain.com/',
          queryString: 'foo=bar',
          css: ['<%= paths.fixtures %>/css/*.css'],
          removeClasses: true,
          preserveStyles: true
        },
        files: {
          'tmp/email-full.html': ['<%= paths.fixtures %>/email-full.html'],
        },
      },

      verbose: {
        files: {
          'tmp/email-verbose.html': ['<%= paths.fixtures %>/email-verbose.html'],
        }
      },

      mediaq: {
        options: {
            css: ['<%= paths.fixtures %>/css/external-mq.css']
        },
        files: {
          'tmp/email-mq.html': ['<%= paths.fixtures %>/email-mq.html'],
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'premailer', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
