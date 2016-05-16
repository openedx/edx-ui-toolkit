module.exports = {
    documentation: {
        targetDir: './_site',
        previewTargetDir: './_preview_site',
        testing: {
            sources: [
                './src/js/utils/spec-helpers/*.js'
            ],
            output: './doc/_testing',
            viewClass: 'testing'
        },
        utilities: {
            sources: [
                './src/js/utils/*.js'
            ],
            output: './doc/_utilities',
            viewClass: 'utility'
        },
        views: {
            sources: [
                './src/js/!(utils)/*.js'
            ],
            output: './doc/_views',
            viewClass: 'view'
        },
        browserSync: {
            server: {
                baseDir: './_site'
            },
            ui: {
                port: 5000,
                weinre: {
                    port: 5002
                }
            }
        },
        templates: [
            './doc/*.md',
            './doc/_data/**/*',
            './doc/_layouts/**/*'
        ],
        static: [
            './doc/static/**/*'
        ],
        gitHubPages: {
            files: './_site/**/*'
        }
    }
};
