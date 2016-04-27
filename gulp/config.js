var dest = './doc/public',
    src = './pattern-library',
    siteDir = './_site',
    docDir = './doc';

module.exports = {
    documentation: {
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
                './src/js/disclosure/*.js',
                './src/js/dropdown-menu/*.js',
                './src/js/pagination/*.js'
            ],
            output: './doc/_views',
            viewClass: 'view'
        },
        browserSync: {
            server: {
                baseDir: siteDir
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
        ]
    }
};
