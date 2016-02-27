module.exports = function(grunt) {

  grunt.initConfig({
    clean: ["cordova/www"],
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
  grunt.loadNpmTasks("grunt-shell");

  grunt.registerTask("default", ["clean", "copy", "shell:cordova"]);

};
