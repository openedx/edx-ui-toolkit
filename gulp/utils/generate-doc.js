'use strict';

const jsdox = require('jsdox'),
    path = require('path'),
    through = require('through2'),
    GulpUtil = require('gulp-util'),
    jsdocParser = require('jsdoc3-parser'),
    PLUGIN_NAME = 'generate-doc',
    analyze = jsdox.analyze,
    generateMD = jsdox.generateMD,
    jsdoxTemplatesDir = 'node_modules/jsdox/templates';

module.exports = (viewClass) =>
    through.obj((file, enc, next) => {
        if (file.isStream()) {
            jsdocParser(file.history, (err, result) => {
                let frontMatter, data, markdown, title, relativePath, requirePath, gitHubPath;
                const fileToPush = file;

                if (err) {
                    console.error('Error generating docs for file', file, err);
                    next(err);
                } else {
                    // Generate the front matter
                    relativePath = path.relative(path.resolve('src'), file.path);
                    requirePath = `edx-ui-toolkit/${relativePath.slice(0, -3)}`;
                    gitHubPath = `blob/master/src/${relativePath}`;

                    title = path.basename(file.path, '.js');
                    frontMatter = `
---
title: ${title}
requirePath: ${requirePath}
githubPath: ${gitHubPath}
viewClass: ${viewClass}
---

`;

                    // Generate the markdown
                    data = analyze(result, {});
                    markdown = generateMD(data, jsdoxTemplatesDir);

                    // set the result to the front matter followed by the markdown
                    fileToPush.contents = new Buffer(frontMatter + markdown);
                }
                self.push(fileToPush);
                next();
            });
        } else {
            this.emit('error', new GulpUtil.PluginError(PLUGIN_NAME, 'Non-streams not supported!'));
            next();
        }
    });
