---
layout: home
---

With more room at our disposal here, lets break the `gruntfile` down a bit further to gain better understanding of what we are accomplishing. In the spirit of open-source, I encourage PRs and logged Issues to make this better and more useful!

First a list of the Grunt plug-ins that we will be using. Each has many more features that aren't used here, and I encourage you to check them out as well:

- [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean)
- [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy)
- [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)
- [grunt-contrib-compass](https://github.com/gruntjs/grunt-contrib-compass)
- [grunt-contrib-modernizr](https://github.com/Modernizr/grunt-modernizr)
- [grunt-contrib-compress](https://github.com/gruntjs/grunt-contrib-compress)
- [grunt-ant-sfdc](https://github.com/kevinohara80/grunt-ant-sfdc)

***

## The Gruntfile

```javascript
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Custom configuration goes in here

  });
};
```
The first part is the "wrapper" function, which encapsulates the Grunt configuration.

Within the "wrapper" function we initialize the configuration object and pull project settings from the `package.json` file into the `pkg` property.

Configuration for each task lives as a property on the configuration object with the same name (so the "clean" task goes in our config object under the "clean" key.) The task and key name come from the corresponding `name` property in `package.json`.

Now we can define configuration for the tasks:


***


## The Clean Task
Full Plug-in documentation available here: [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean).
```javascript
// Remove assets that will be overwritten (just to be safe)
clean: [
    // These are managed by Bower and could be updated intermittently
    'fonts/**',
    'js/jquery.min.js',

    // Compass only rewrites the .css file if it detects a change...
    // Can cause issues if you are going from Dev CSS to Prod CSS.
    'css/site.css',

    // ModerizR gets custom built each time to for account for CSS Development
    'js/modernizr-custom.js',

    // The final output that goes to SalesForce. Will be modified each build
    'src/staticresources/**'
]
```
The Clean task simply cleans (deletes) the files that will be overwritten as the other tasks run. List paths to the files you want to delete in an array.

## The Copy Task
```javascript
// Copy Bower Components into the Static Resource folder for build
// Gotta make sure the latest version of the files is always the one that gets included!
copy: {
    main: {
        files: [
        // JQUERY
        // For now we are stuck on v1.11.2 because SFDC doesn't support IE8...
        // but in the future we'll want to make sure we have the latest juice
        {
            expand: true,
            src: ['app/_/bower_components/jquery-legacy/dist/jquery.min.js'],
            dest: 'js/',
            flatten: true
        },
        // Bootstrap Glyphicons
        {
            expand: true,
            src: ['app/_/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*'],
            dest: 'fonts/bootstrap/',
            flatten: true
        },
        // Font Awesome
        {
            expand: true,
                        src: ['app/_/bower_components/fontawesome/fonts/*'],
                        dest: 'fonts/',
                        flatten: true
                    }
                ]
            }
        }
```
The Copy Task

## JavaScript Linting Task
```javascript
// For now we are just linting config files because my JSON syntax sucks
// As we build up the JS processing we'll use this more
jshint: {
    options: {
        es3: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
            jQuery: true
        }
    },
    all: [
        // This file
        'Gruntfile.js',

        // Node packages file
        'package.json',

        // Bower packages file
        'bower.json'
    ]
}
```
The JSHint plugin is also very simple to configure:
JSHint simply takes an array of files and then an object of options. These are all [documented on the JSHint site](http://www.jshint.com/docs/). If you're happy with the JSHint defaults, there's no need to redefine them in the Gruntfile.

## Compass Task
```javascript
// Run Compass to process all .scss includes
compass: {
    dev: {
        options: {
            config: 'config.rb'
        }
    },
    prod: {
        options: {
            config: 'config.rb',
            // Overwrite :expanded from config.rb for Production Build
            outputStyle: 'compressed',
            // Remove line comments for Production Build
            noLineComments: true
        }
    }
}
```
The Compass task

## ModernizR Task
```javascript
modernizr: {
    dist: {
        // [REQUIRED] Path to the build you're using for development.
        "devFile" : "app/_/bower_components/modernizr/modernizr.js",

       // Path to save out the built file.
       "outputFile" : "js/modernizr-custom.js",

       // Based on default settings on http://modernizr.com/download/
       "extra" : {
           "shiv" : true,
           "printshiv" : false,
           "load" : true,
           "mq" : false,
           "cssclasses" : true
        },

        // Based on default settings on http://modernizr.com/download/
        "extensibility" : {
            "addtest" : false,
            "prefixed" : false,
            "teststyles" : false,
            "testprops" : false,
            "testallprops" : false,
            "hasevents" : false,
            "prefixes" : false,
            "domprefixes" : false,
            "cssclassprefix": ""
        },

        // By default, source is uglified before saving
        "uglify" : true,

        // Define any tests you want to implicitly include.
        "tests" : ['forms-placeholder'],

        // By default, this task will crawl your project for references to Modernizr tests.
        // Set to false to disable.
        "parseFiles" : true,

        // When parseFiles = true, this task will crawl all *.js, *.css, *.scss and *.sass files,
        // except files that are in node_modules/.
        // You can override this by defining a "files" array below.
        // "files" : {
            // "src": []
        // },

        // This handler will be passed an array of all the test names passed to the Modernizr API, and will run after the API call has returned
        // "handler": function (tests) {},

        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        "matchCommunityTests" : true,

       // Have custom Modernizr tests? Add paths to their location here.
       "customTests" : [
           "noncore-tests/forms-placeholder.js"
       ]
   }
}
```
The ModernizR Task

## Compress Task
```javascript
compress: {
    main: {
        options: {
            archive : "src/staticresources/<%= pkg.name %>.resource",
            mode: 'zip'
        },
        files: [
            { src: ['css/**'], dest: '/' },
            { src: ['fonts/**'], dest: '/'},
            { src: ['img/**'], dest: '/'},
            { src: ['js/**'], dest: '/'}
        ]
    }
}
```
The Compress Task


## AntDeploy Task
```javascript
// Deploy to SFDC
antdeploy: {
    options: {
        root: 'src/'
    },
    dev1: {
        options: {
        user:      '',
        pass:      '',
        token:     '',
        serverurl: '' // default => https://login.salesforce.com
        },
        pkg: {
            staticresources: ['*']
        }
    }
}
```
The Antdeploy Task


## More Grunt Functionality
Finally, we have to load in the Grunt plugins we need. These should have all been installed through npm.
```javascript
// Load the plugins.
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-modernizr');
grunt.loadNpmTasks('grunt-contrib-compress');
grunt.loadNpmTasks('grunt-ant-sfdc');
```


## Custom Grunt Task to write the Meta Data file that pairs with the Static Resource
```javascript
// custom task to write the -meta.xml file for the metadata deployment
grunt.registerTask('write-meta', 'Write the required salesforce metadata', function() {
    grunt.log.writeln('Writing metadata...');
    var sr = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">',
        '  <cacheControl>Public</cacheControl>',
        '  <contentType>application/zip</contentType>',
        '  <description>MyTest Description</description>',
        '</StaticResource>'
    ];
    var dest = grunt.template.process('<%= compress.main.options.archive %>') + '-meta.xml';
    grunt.file.write(dest, sr.join('\n'));
});
```


And finally set up some tasks. Most important is the default task:
```javascript
/**
* Task: Local build of Static Resources
* -
* - Run Compass with expanded CSS and Line Comments for Debugging
* -
*/
grunt.registerTask('default', ['clean', 'copy', 'jshint:all', 'compass:dev', 'modernizr', 'compress', 'write-meta']);

/**
* Task: Development build of Static Resources
* - Clean old CSS Directory
* - Run Compass with expanded CSS and Line Comments for Debugging
* - Deploy Processed CSS File to SFDC as a Static Resource
*/
grunt.registerTask('dev', ['clean', 'copy', 'jshint:all', 'compass:dev', 'modernizr', 'compress', 'write-meta', 'antdeploy']);

/**
* Task: Production Build of Static Resources
* - Clean old CSS Directory
* - Run Compass with minified CSS for Testing and Production
* - Deploy Processed CSS File to SFDC as a Static Resource
*/
grunt.registerTask('prod', ['clean', 'copy', 'jshint:all', 'compass:prod', 'modernizr', 'compress', 'write-meta', 'antdeploy']);
```