(function(define) {
    'use strict';

    define([
        'jquery',
        '../../utils/html-utils.js',
        '../../utils/spec-helpers/spec-helpers.js',
        '../breadcrumbs-view.js',
        '../breadcrumbs-model.js'
    ],
    ($, HtmlUtils, SpecHelpers, BreadcrumbsView, BreadcrumbsModel) => {
        describe('BreadcrumbsView', () => {
            let model;
            let view;

            beforeEach(() => {
                model = new BreadcrumbsModel();
                view = new BreadcrumbsView({
                    model
                });
            });

            it('does not show breadcrumbs by default', () => {
                expect(view.$el.html()).not.toContain('<nav class="breadcrumbs">');
            });

            SpecHelpers.withData({
                'with no breadcrumbs': [[]],
                'with one breadcrumb': [[
                    {url: 'url1', title: 'Crumb 1'}
                ]],
                'with two breadcrumbs': [[
                    {url: 'url1', title: 'Crumb 1'},
                    {url: 'url2', title: 'Crumb 2'}
                ]],
                'with unicode breadcrumbs': [[
                    {url: '', title: '☃'}
                ]],
                'with breadcrumbs containing HTML': [[
                    {url: '', title: '<h1>crumb!</h1>'}
                ]]
            }, (breadcrumbs) => {
                model.set('breadcrumbs', breadcrumbs);

                const crumbs = view.$('.nav-item');
                const linkCrumbs = crumbs.slice(0, -1);

                expect(crumbs.length).toBe(breadcrumbs.length);

                linkCrumbs.each((index, el) => {
                    expect($('a', el).attr('href')).toEqual(breadcrumbs[index].url);
                    expect($('a', el).text()).toEqual(breadcrumbs[index].title);
                });

                if (crumbs.length > 0) {
                    // The last crumb is not a link
                    const lastCrumb = crumbs.length - 1;
                    expect(crumbs.eq(lastCrumb).text()).toEqual(breadcrumbs[lastCrumb].title);
                    expect(crumbs.eq(lastCrumb).is('a')).toBeFalsy();
                }
            });
        });
    });
}).call(this, define || RequireJS.define);
