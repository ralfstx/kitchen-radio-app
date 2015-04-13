module.exports = function(grunt) {

  grunt.initConfig({
    clean: ["cordova/www"],
    jshint: {
      options: {
        jshintrc: true
      },
      all: ["Gruntfile.js", "src/*.js", "test/*.js"]
    },
    jasmine_node: {
      options: {
        forceExit: true,
        match: ".",
        matchall: false,
        extensions: "js",
        specNameMatcher: "spec"
      },
      all: ["spec/"]
    },
    copy: {
      src: {
        expand: true,
        src: ["package.json", "src/**", "node_modules/tabris/**", "node_modules/underscore/**"],
        dest: "cordova/www/"
      }
    },
    shell: {
      cordova: {
        command: ["cd cordova", "cordova build"].join("&&")
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jasmine-node");
  grunt.loadNpmTasks("grunt-shell");

  grunt.registerTask("test", ["jshint", "jasmine_node"]);
  grunt.registerTask("build", ["copy", "shell"]);
  grunt.registerTask("default", ["clean", "test", "build"]);

};
