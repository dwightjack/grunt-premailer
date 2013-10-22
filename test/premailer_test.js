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

  txt: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/email.txt');
    var expected = grunt.file.read('test/expected/email.txt');
    test.equal(actual, expected, 'Email converted from HTML to plain text');

    test.done();
  },

  full: function(test) {
    test.expect(3);

    var actual = grunt.file.read('tmp/email-full.html');

    var bodyClassRegex = /class=("|')[^'"]*body\-class/;

    var externalCSSRegex = /<body style="[^"]*margin: 10px/;

    test.equal(bodyClassRegex.test(actual), false, "Class attributes removed");
    test.ok(externalCSSRegex.test(actual), "External CSS applied");
    test.ok(actual.indexOf('<a href="http://www.mydomain.com/link.php?foo=bar">') !== -1, "Base URL and query string applied");

    test.done();
  },
};
