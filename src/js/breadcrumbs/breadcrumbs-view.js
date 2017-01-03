/**
 * A Backbone view that renders breadcrumbs-type tiered navigation.
 *
 * Initialize the view by passing in the following attributes:
 *
 *~~~ javascript
 * const view = new BreadcrumbsView({
 *     el: $('selector for element that will contain breadcrumbs'),
 *     model: new BreadcrumbsModel({
 *         breadcrumbs: [{url: '/', title: 'Overview'}]
 *     }),
 *     events: {
 *         'click nav.breadcrumbs a.nav-item': (event) => {
 *             event.preventDefault();
 *             window.location = $(event.currentTarget).attr('href');
 *         }
 *     }
 * });
 *~~~
 * @module BreadcrumbsView
 */
((define) => {
    'use strict';
    define(['backbone', 'edx-ui-toolkit/js/utils/html-utils', 'text!./breadcrumbs.underscore'],
        (Backbone, HtmlUtils, breadcrumbsTemplate) => {
            class BreadcrumbsView extends Backbone.View {
                initialize() {
                    this.template = HtmlUtils.template(breadcrumbsTemplate);
                    this.listenTo(this.model, 'change', this.render);
                    this.render();
                }

                render() {
                    const json = this.model.attributes;
                    HtmlUtils.setHtml(this.$el, this.template(json));
                    return this;
                }
            }

            return BreadcrumbsView;
        });
}).call(
    this,
    // Use the default 'define' function if available, else use 'RequireJS.define'
    typeof define === 'function' && define.amd ? define : RequireJS.define
);
