module.exports = function(grunt) {

  grunt.initConfig({
    clean: ["build"],
    copy: {
      app: {
        expand: true,
        src: [
          "package.json",
          "src/**",
          "node_modules/tabris/**",
          "node_modules/underscore/**",
          "node_modules/whatwg-fetch/**",
          "node_modules/babel-polyfill/**"
        ], //*/
        dest: "build/app/"
      },
      cordova: {
        expand: true,
        cwd: "cordova",
        src: "**",
        dest: "build/cordova/"
      }
    },
    babel: {
      app: {
        options: {
          presets: ['es2015'],
          retainLines: true,
          babelrc: false
        },
        files: [{
          expand: true,
          cwd: "src/",
          src: "**/*.js",
          dest: "build/app/src"
        }]
      }
    },
    shell: {
      serve: {
        command: "hs -c-1",
        options: {
          execOptions: {
            cwd: 'build/app'
          }
        }
      },
      cordova: {
        command: ["cd cordova", "cordova build"].join("&&")
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-shell");

  grunt.registerTask("default", ["clean", "copy:app", "babel:app"]);

  grunt.registerTask("serve", ["default", "shell:serve"]);

  grunt.registerTask("cordova", ["default", "copy:cordova", "shell:cordova"]);

};
