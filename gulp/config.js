var dest = './doc/public',
    src = './pattern-library',
    local = './_site',
    doc_src = './doc';

module.exports = {
    browserSync:                {
        server:                 {
            // Serve up our build folder
            baseDir:            local
        }
    },
    styles:                     {
        settings_development: {
            outputStyle: 'expanded',
            sourcemapsLocation: '.',
            includePaths: [
                'node_modules'
            ]
        },

        // documentation site
        doc_src:              doc_src + '/static/sass',
        doc_src_files:        doc_src + '/static/sass/**/*.scss',
        doc_dest:             dest + '/css',
        doc_dest_files:       dest + '/css/**/*.css',
        doc_local:            local + '/public/css'
    },
    lib:                    {
        // third party libraries
        src:                    './node_modules'
    },
    documentation: {
        utilities: {
            sources: [
                'src/js/utils'
            ],
            output: './doc/_utilities',
            viewClass: 'utility'
        },
        views: {
            sources: [
                'src/js/disclosure',
                'src/js/dropdown-menu',
                'src/js/pagination'
            ],
            output: './doc/_views',
            viewClass: 'view'
        }
    },
    jekyll:                     {
        home:                   'index.html',
        posts:                  'doc/_posts/**/*',
        includes:               'doc/_includes/**/*',
        layouts:                'doc/_layouts/**/*'
    }
};
