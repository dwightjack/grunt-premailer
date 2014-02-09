'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.premailer = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  html: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/email.html');
    test.ok(actual.indexOf('<body style="color: red;">') !== -1, 'Test CSS style is inline.');

    test.done();
  },

  multiple: function(test) {
    test.expect(1);

    var first = grunt.file.read('tmp/email.html');
    var second = grunt.file.read('tmp/email-2.html');
    test.notStrictEqual(first, second, 'Multiple file targets are processed independently.');

    test.done();
  },

  txt: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/email.txt');
    var expected = grunt.file.read('test/expected/email.txt');
    test.equal(actual, expected + "\n", 'Email converted from HTML to plain text');

    test.done();
  },

  full: function(test) {
    test.expect(6);

    var actual = grunt.file.read('tmp/email-full.html');

    var bodyClassRegex = /class=("|')[^'"]*body\-class/;

    var externalCSSRegex = /<body style="[^"]*color: red/;
    var externalCSSRegex2 = /<body style="[^"]*width: 10px/;

    test.equal(bodyClassRegex.test(actual), false, "Class attributes removed");
    test.ok(externalCSSRegex.test(actual), "External CSS applied");
    test.ok(externalCSSRegex2.test(actual), "Second External CSS applied");
    test.ok(actual.indexOf('<a href="http://www.mydomain.com/link.php?foo=bar">') !== -1, "Base URL and query string applied");
    test.equal(actual.indexOf('<script'), -1, "Script tags removed");
    test.ok(actual.indexOf('<style') !== -1, "Style tags are kept in source");

    test.done();
  },

  verbose: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/email-verbose.html');


    test.ok(actual.indexOf('</html>') > 0, "Long email got completely parsed");
    test.done();

  },

  mediaq: function (test) {
    test.expect(2);

    var actual = grunt.file.read('tmp/email-mq.html');

    test.ok(actual.indexOf('@media only screen and (max-width: 600px)') > 0, "Media Queries are preserved");
    test.ok(actual.indexOf('@media only screen and (min-width: 400px)') > 0, "Media Queries from external files are preserved");
    test.done();

  }
};
