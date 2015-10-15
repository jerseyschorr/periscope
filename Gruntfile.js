'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.initConfig({
        "eslint": {
            target: ['lib/*.+(es6)']
        },
        "babel": {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    "build/periscope.js": "lib/periscope.es6"
                }
            }
        }
    });


    // Default task
    grunt.registerTask('default', ['lint', 'build']);

    grunt.registerTask('lint',  ['eslint']);
    grunt.registerTask('build', ['babel']);

};
