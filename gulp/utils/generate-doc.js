(function () {
    var jsdox = require('jsdox'),
        path = require('path'),
        through = require('through2'),
        GulpUtil = require('gulp-util'),
        jsdocParser = require('jsdoc3-parser'),
        PLUGIN_NAME = 'generate-doc',
        analyze = jsdox.analyze,
        generateMD = jsdox.generateMD,
        jsdoxTemplatesDir = 'node_modules/jsdox/templates';

    module.exports = function (viewClass) {
        return through.obj(function (file, enc, next) {
            var self = this;
            if (file.isStream()) {
                jsdocParser(file.history, function (err, result) {
                    var frontMatter, data, markdown, title, relativePath, requirePath, gitHubPath;
                    if (err) {
                        console.error('Error generating docs for file', file, err);
                        next(err);
                    } else {
                        // Generate the front matter
                        relativePath = path.relative(path.resolve('src'), file.path);
                        requirePath = 'edx-ui-toolkit/' + relativePath.slice(0, -3);
                        gitHubPath = 'blob/master/src/' + relativePath;
                        // title = path.relative(path.resolve('src/js'), file.path).slice(0, -3);
                        title = path.basename(file.path, '.js');
                        frontMatter = '---\n' +
                            'title: ' + title + '\n' +
                            'requirePath: ' + requirePath + '\n' +
                            'githubPath: ' + gitHubPath + '\n' +
                            'viewClass: ' + viewClass + '\n' +
                            '---\n\n';

                        // Generate the markdown
                        data = analyze(result, {});
                        markdown = generateMD(data, jsdoxTemplatesDir);

                        // set the result to the front matter followed by the markdown
                        file.contents = new Buffer(frontMatter + markdown);
                    }
                    self.push(file);
                    next();
                });
            } else {
                this.emit('error', new GulpUtil.PluginError(PLUGIN_NAME, 'Non-streams not supported!'));
                next();
            }
        });
    };
})();
