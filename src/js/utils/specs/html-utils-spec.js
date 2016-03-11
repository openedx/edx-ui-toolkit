define(
    [
        '../../utils/spec-helpers/spec-helpers.js',
        '../html-utils.js'
    ],
    function(SpecHelpers, HtmlUtils) {
        'use strict';

        describe('HtmlUtils', function() {
            describe('HtmlSnippet', function() {
                it('can convert to a string', function() {
                    expect(new HtmlUtils.HtmlSnippet('Hello, world').toString()).toBe('Hello, world');
                });
            });

            describe('HTML', function() {
                it('returns an HtmlSnippet', function() {
                    expect(HtmlUtils.HTML('Hello, world') instanceof HtmlUtils.HtmlSnippet).toBeTruthy();
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
                    expect(result.toString()).toBe(expectedString);
                });
            });

            describe('interpolateHtml', function() {
                it('can interpolate a string with no parameters provided', function() {
                    expect(HtmlUtils.interpolateHtml('Hello, world').toString()).toBe(
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
                    expect(result.toString()).toBe(expectedString);
                });
            });

            describe('template', function() {
                it('returns a template that renders correctly', function() {
                    var template = HtmlUtils.template('Hello, <%- name %>'),
                        result = template({name: 'world'});
                    expect(result instanceof HtmlUtils.HtmlSnippet).toBeTruthy();
                    expect(result.toString()).toBe('Hello, world');
                });

                it('adds HtmlView as an additional context variable for the template', function() {
                    var template = HtmlUtils.template('I love <%= HtmlUtils.escape("Rock & Roll") %>');
                    expect(template().toString()).toBe('I love Rock &amp; Roll');
                });
            });
        });
    }
);
