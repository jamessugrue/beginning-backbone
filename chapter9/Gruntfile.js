module.exports = function(grunt) {

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: false,
        globals: {
          jQuery: true
        },
        ignores: ['js/external/**/.*.js'], 
        reporterOutput : 'reports/jshint.txt'


      },
      files: {
        src: ['js/app/**/*.js']
      },
  },
  

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n', 
        report: 'min'
      },

      externalLibraries: {
        files:{
          'build/external.min.js' : ['js/external/jquery-1.10.2.js',
                                    'js/external/underscore.js',
                                    'js/external/backbone.js',
                                    'js/external/handlebars.js',
                                    'js/external/moment.js', 
                                    'js/external/dialog.js']
        }
      }, 
      app: {
        files : {
          'build/app.min.js'       : ['js/app/model/*.js', 'js/app/collection/*.js', 
                                      'js/app/view/*.js', 'js/app/router/*.js',
                                      'js/app/util/*.js', 'js/app/*.js' ],
        }
      }
    }, 
    cssmin:{
      combine:{
          files: {
            'build/app.min.css' : ['css/**.css']
          }
      }
    }, 

    qunit:{
      all: {
        options: {
          urls: ['http://localhost/backbone/chapter9/js/test/app.html']
        }
      }
    }, 

    //qunit reports
     qunit_junit: {
            options: {
               //the location to generate reports to
               dest: 'reports/'
            }
      }, 


  //jasmine tests
  jasmine: {
    main: {
    src: ['js/app/model/Profile.js', 'js/app/model/Tweet.js', 'js/app/collection/Timeline.js'],

    options: {
         specs: 'js/test/jasmine/spec/ProfileSpec.js', 
         vendor : ['js/test/sinon.js', 'build/external.min.js', 'js/test/jasmine/lib/jasmine-jquery.js'],
         junit :{
          path: 'reports/'
         } 
        }
      }, 
  }

  });


  // Load required plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-qunit-junit');
  grunt.loadNpmTasks('grunt-contrib-jasmine');



  // Default task(s).
  grunt.registerTask('dev', ['jshint',  'qunit_junit', 'qunit', 'jasmine']);
  grunt.registerTask('build', ['jshint',  'uglify', 'cssmin', 'qunit_junit', 'qunit', 'jasmine']);
  
  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'qunit_junit', 'qunit', 'jasmine']);
  
};

