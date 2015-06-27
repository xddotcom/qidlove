module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {}
        },
        sass: {
            app: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                src: 'assets/stylesheets/app.scss',
                dest: 'assets/stylesheets/app.css'
            }
        },
        includes: {
            files: {
                src: ['html/index.html'],
                dest: '.',
                cwd: '.',
                flatten: true
            }
        },
        watch: {
            stylesheets: {
                files: ['assets/stylesheets/**/*.scss'],
                tasks: ['sass']
            },
            html: {
                files: ['html/*.html'],
                tasks: ['includes']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    keepalive: true
                }
            }
        },
        concurrent: {
            dist: {
                tasks: ['concat', 'sass', 'includes'],
                options: {
                    logConcurrentOutput: true
                }
            },
            server: {
                tasks: ['watch', 'connect'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-connect');
    
    // Configurable port number
    grunt.registerTask('server', 'concurrent:server');
    grunt.registerTask('dist', 'concurrent:dist');

};
