module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: ["Gruntfile.js", "lib/**/*.js"]
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("default", ["jshint"]);

};
