/**
 * A Backbone model that works with the BreadcrumbsView to provide breadcrumb navigation
 *
 * Here's what initializing a BreadcrumbsModel looks like:
 *
 *~~~ javascript
 * const model = new BreadcrumbsModel({
 *     breadcrumbs: [
 *         {
 *             url: '/',
 *             title: 'Item List'
 *         },
 *         {
 *             url: '/details/1',
 *             title: 'Item Details'
 *         }
 *     ],
 *     label: 'Demo Page'
 * });
 *~~~
 * @module BreadcrumbsModel
 */
(function(define) {
    'use strict';

    define(['backbone'], (Backbone) => {
        class BreadcrumbsModel extends Backbone.Model {
            defaults() {
                return {
                    breadcrumbs: null,
                    label: ''
                };
            }
        }

        return BreadcrumbsModel;
    });
}).call(
    this,
    // Use the default 'define' function if available, else use 'RequireJS.define'
    typeof define === 'function' && define.amd ? define : RequireJS.define
);
