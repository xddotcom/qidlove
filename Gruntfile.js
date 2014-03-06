module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: { },
            bootstrap: {
                src: [
                    'js/bootstrap/transition.js',
                    'js/bootstrap/alert.js',
                    'js/bootstrap/button.js',
                    'js/bootstrap/carousel.js',
                    'js/bootstrap/collapse.js',
                    'js/bootstrap/dropdown.js',
                    'js/bootstrap/modal.js',
                    'js/bootstrap/tooltip.js',
                    'js/bootstrap/popover.js',
                    'js/bootstrap/scrollspy.js',
                    'js/bootstrap/tab.js',
                    'js/bootstrap/affix.js'
                ],
                dest: 'js/bootstrap.js'
            }
        },
        less: {
            options: {
                cleancss: true,
                report: 'min'
            },
            bootstrap: {
                src: 'less/bootstrap.less',
                dest: 'css/bootstrap.css'
            },
            bootstrap_theme: {
                src: 'less/bootstrap-theme.less',
                dest: 'css/bootstrap-theme.css'
            },
            app: {
                src: ['less/app.less'],
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
            scripts_bootstrap: {
                files: ['js/bootstrap/**/*.js'],
                tasks: ['concat:bootstrap']
            },
            less: {
                files: ['less/**/*.less', '!less/app.less'],
                tasks: ['less']
            },
            less_app: {
                files: ['less/app.less'],
                tasks: ['less:app']
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
                tasks: ['concat', 'less', 'includes'],
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

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    
    // Configurable port number
    var port = grunt.option('port');
    if (port) grunt.config('connect.server.options.port', port);
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('server', 'concurrent:server');
    grunt.registerTask('dist', 'concurrent:dist');

};
