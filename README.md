# grunt-premailer

> Grunt wrapper task for [Premailer](https://github.com/alexdunae/premailer/)


##Requirements

This plugin is a [Grunt](http://gruntjs.com/)  wrapper around the [Premailer](https://github.com/alexdunae/premailer/) Ruby gem developed by Alex Dunae. In order to run it you will need the following packages installed on your system:

* Node.js >= 0.10.0 ([install wiki](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
* Grunt-cli >= 0.1.7 and Grunt >=0.4.2 (`npm install grunt-cli -g`)
* Ruby >= 1.8.7 ([installers](http://www.ruby-lang.org/en/downloads/))
* Premailer >= 1.8.0 (`gem install premailer` and, most of the time, `gem install hpricot`)

## Getting Started

This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-premailer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-premailer');
```

## The "premailer" task

### Overview
In your project's Gruntfile, add a section named `premailer` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  premailer: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.mode
Type: `String`
Default value: `'html'`

Output format. Either `'html'` (HTML formatted email) or `'txt'` (plaintext email).

#### options.baseUrl
Type: `String`
Default value: `''`

Base URL to append to relative links.

#### options.queryString
Type: `String`
Default value: `''`

Query string to append to links.

#### options.css
Type: `Array`
Default value: `[]`

Additional CSS stylesheets to process. Paths are relative to the `Gruntfile.js` file. Any Grunt compatible globbing and template syntax is supported. 

#### options.removeClasses
Type: `Boolean`
Default value: `false`

Removes HTML classes.

#### options.removeComments
Type: `Boolean`
Default value: `false`

Removes HTML comments.


#### options.preserveStyles
Type: `Boolean`
Default value: `false`

Preserve any `link rel=stylesheet` and `style` elements.

#### options.lineLength
Type: `Number`
Default value: `65`

Line length for plaintext version.

#### options.ioException
Type: `Boolean`
Default value: `false`

Aborts on I/O errors.

#### options.verbose
Type: `Boolean`
Default value: `false`

Prints additional information at runtime.

### Usage Examples

#### Default Options
In this example, the default options are used to inline CSS styles in into the markup.

```js
grunt.initConfig({
  premailer: {
    simple: {
      options: {},
      files: {
        'dest/email.html': ['src/email.html']
      }
    }
  }
})
```

#### Custom Options
In this example, custom options are used to append a query string (such as a google campaign click tracking) to every link.

```js
grunt.initConfig({
  premailer: {
    withqs: {
      options: {
        queryString: 'utm_source=premailer&utm_medium=email&utm_campaign=test'
      },
      files: {
        'dest/email.html': ['src/email.html']
      }
    }
  }
})
```

####Usage Notes

**`BaseUrl` option and stylesheets parsing**

Be aware that the base URL gets applied _before_ inlining styles. This process will convert all relative linked stylesheets to absolute ones, possibly preventing the parser to retrieve the resources (since `link` tags point to a different location).  
In this scenario it's advisable to use the `css` option since it's uneffected from `BaseUrl`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

0.2.5 Added ability to remove temp folders even outside project folder (thanx to @fadomire)

0.2.4 Updated dependencies to Nodejs 0.10+, Grunt 0.4.2+ and Premailer 1.8.0+ (media query support). Added postinstall check for Premailer gem version.

0.2.3 Check for large HTML emails (see https://github.com/dwightjack/grunt-premailer/issues/1)

0.2.2 Bugfix when passing multiple file targets (see #5)

0.2.1 Bugfix in custom premailer script

0.2.0 - Moved to custom ruby script to execute premailer instead of `premailer` binary. Added `removeComments` and `preserveStyles` options. Premailer not requires v1.7.8 or greater.

0.1.1 - Replaced [deprecated](http://gruntjs.com/blog/2013-11-21-grunt-0.4.2-released) reference to `grunt.util._` with `lodash` npm module

0.1.0 - Initial release
