module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    grunt: {
      sip_js: {
        gruntfile: 'sip.js/Gruntfile.js',
        task: 'build'
      }
    },

    concat: {
      sip_js_to_app: {
        src: 'sip.js/dist/sip.js',
        dest: 'app/js/sip.js'
      },
      sip_js_to_node: {
        src: 'sip.js/dist/sip.js',
        dest: 'node/sip.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-grunt');

  grunt.registerTask('sip.js', [
    'grunt:sip_js',
    'concat:sip_js_to_app',
    'concat:sip_js_to_node'
  ]);


  grunt.registerTask('default', ['sip.js']);
}