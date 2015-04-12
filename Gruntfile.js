module.exports = function(grunt) {

  grunt.initConfig({
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
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jasmine-node");

  grunt.registerTask("test", "jasmine_node");
  grunt.registerTask("default", ["jshint", "test"]);

};
