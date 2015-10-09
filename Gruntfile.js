'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-eslint');

    grunt.initConfig({
        eslint: {
            target: ['lib/*.+(es6|js)']
        }
    });

    // Default task
    grunt.registerTask('default', ['lint']);

    grunt.registerTask('lint', ['eslint']);

};
