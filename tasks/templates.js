'use strict';

var path = require('path');

module.exports = function(grunt){

    grunt.registerMultiTask('templates', 'Compile all templates', function(){

        this.files.forEach(function(f){
            var code = '$(function() {\n\twindow.TPL = {\n';
                
            code += f.src.map(
                function(filepath){
                    var mustache = grunt.file.read(filepath);
                    var key = path.basename(filepath, path.extname(filepath));
                    // Clean up some spaces
                    mustache = mustache.replace(/[\r\n\t]+/g, '');
                    return "\t\t'" + key + "': Mustache.compile('" + mustache + "')";
                }
            ).join(',\n');
            
            code += '\n\t};\n});\n';

            grunt.file.write(f.dest, code);
            grunt.log.writeln('File "' + f.dest + '" created.');
        });

    });

};
