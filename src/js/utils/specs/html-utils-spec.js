define(
    [
        'jquery',
        '../../utils/spec-helpers/spec-helpers.js',
        '../html-utils.js'
    ],
    function($, SpecHelpers, HtmlUtils) {
        'use strict';

        describe('HtmlUtils', function() {
            describe('HTML', function() {
                it('returns a string flagged as an HTML snippet', function() {
                    expect(HtmlUtils.HTML('Hello, world').isHtmlSnippet).toBeTruthy();
                });

                it('returns an HTML snippet that can be used by JQuery', function() {
                    var testHtmlString = '<p>A test</p>',
                        htmlSnippet = HtmlUtils.HTML(testHtmlString);
                    setFixtures('<div class="test"></div>');
                    $('.test').html(htmlSnippet);
                    expect($('.test').html()).toBe(testHtmlString);
                    $('.test').append(htmlSnippet);
                    expect($('.test').html()).toBe(testHtmlString + testHtmlString);
                });
            });

            describe('escape', function() {
                SpecHelpers.withData({
                    'HTML escapes text strings': [
                        'Rock & Roll',
                        'Rock &amp; Roll'
                    ],
                    'HTML escapes full HTML strings': [
                        '<a href="world">Rock &amp; Roll</a>',
                        '&lt;a href=&quot;world&quot;&gt;Rock &amp;amp; Roll&lt;/a&gt;'
                    ],
                    'does not escape HTML snippets': [
                        HtmlUtils.HTML('<a href="world">Rock &amp; Roll</a>'),
                        '<a href="world">Rock &amp; Roll</a>'
                    ]
                }, function(input, expectedString) {
                    var result = HtmlUtils.escape(input);
                    expect(result).toEqual(expectedString);
                });
            });

            describe('interpolateHtml', function() {
                it('can interpolate a string with no parameters provided', function() {
                    expect(HtmlUtils.interpolateHtml('Hello, world')).toEqual(
                        'Hello, world'
                    );
                });

                SpecHelpers.withData({
                    'can interpolate a string with empty parameters': [
                        'Hello, world', {},
                        'Hello, world'
                    ],
                    'can interpolate a string with one parameter': [
                        'Hello, {name}', {name: 'Andy'},
                        'Hello, Andy'
                    ],
                    'does not interpolate additional curly braces': [
                        'Hello, {name}. Here is a { followed by a }', {name: 'Andy'},
                        'Hello, Andy. Here is a { followed by a }'
                    ],
                    'escapes characters in the template': [
                        'Rock & Roll', {},
                        'Rock &amp; Roll'
                    ],
                    'does not escape HTML parameters': [
                        'Hello, {anchor}', {anchor: HtmlUtils.HTML('<a href="world">world</a>')},
                        'Hello, <a href="world">world</a>'
                    ],
                    'escapes characters in parameters': [
                        'I love {name}', {name: 'Rock & Roll'},
                        'I love Rock &amp; Roll'
                    ],
                    'does not double escape when chaining interpolate calls': [
                        'I love {name}', {name: HtmlUtils.interpolateHtml('Rock & Roll')},
                        'I love Rock &amp; Roll'
                    ],
                    'full example': [
                        'You are enrolling in {spanStart}{courseName}{spanEnd}',
                        {
                            courseName: 'Rock & Roll',
                            spanStart: HtmlUtils.HTML('<span class="course-title">'),
                            spanEnd: HtmlUtils.HTML('</span>')
                        },
                        'You are enrolling in <span class="course-title">Rock &amp; Roll</span>'
                    ]
                }, function(template, options, expectedString) {
                    var result = HtmlUtils.interpolateHtml(template, options);
                    expect(result).toEqual(expectedString);
                });
            });

            describe('template', function() {
                it('returns a template that renders correctly', function() {
                    var template = HtmlUtils.template('Hello, <%- name %>'),
                        result = template({name: 'world'});
                    expect(result).toEqual('Hello, world');
                });

                it('adds HtmlView as an additional context variable for the template', function() {
                    var template = HtmlUtils.template('I love <%= HtmlUtils.escape("Rock & Roll") %>');
                    expect(template()).toEqual('I love Rock &amp; Roll');
                });
            });
        });
    }
);
