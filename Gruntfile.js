module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: { }
        },
        sass: {
            app: {
                options: { style: 'compressed' },
                src: 'scss/app.scss',
                dest: 'css/app.css'
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
                files: ['scss/bootstrap/*.scss', 'scss/_*.scss', 'scss/bootstrap.scss'],
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
                    base: '.',
                    keepalive: true,
                    hostname: null,
                    middleware: function(connect, options){
                        var appcache = grunt.option('appcache');
                        return [
                            function(req, res, next){
                                if (req.url == '/manifest.appcache' && !appcache){
                                    res.writeHead(404);
                                    res.end();
                                } else {
                                    next();
                                }
                            },
                            connect.static(options.base),
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        },
        concurrent: {
            dist: {
                tasks: ['concat', 'sass', 'includes'],
                options: { logConcurrentOutput: true }
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
    
    // Configurable port number
    var port = grunt.option('port');
    if (port) grunt.config('connect.server.options.port', port);
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('server', 'concurrent:server');
    grunt.registerTask('dist', 'concurrent:dist');

};
