module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


//        githooks: {
//            all: {
//            // Will run the jshint and test:unit tasks at every commit
//            'pre-commit': 'jshint test:unit',
//            }
//        },

        // Remove assets that will be overwritten (just to be safe)
        clean: [
            // These are managed by Bower and could be updated intermittently
            'fonts/**',
            'js/jquery.min.js',

            // Compass only rewrites the .css file if it detects a change...
            // Can cause issues if youa re going from Dev CSS to Prod CSS.
            'css/site.css',

            // ModerizR gets custom built each time to for account for CSS Development
            'js/modernizr-custom.js',

            // The final output that goes to SalesForce. Will be modified each build
            'src/staticresources/**'
        ],

        // Copy Bower Components into the Static Resource folder for build
        // Gotta make sure the latest version of the files is always the one that gets included!
        copy: {
            main: {
                files: [
                    // JQUERY
                    // For now we are stuck on v1.11.2 because v2 doesn't support IE8...
                    // but in the future we'll want to ake sure we have the latest juice
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
        },

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
        },

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
        },

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
        },

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
        },

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

    });

    // Load the plugins.
//    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-ant-sfdc');

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

};
