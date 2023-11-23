define(
    [
        'jquery',
        '../../utils/spec-helpers/spec-helpers.js',
        '../html-utils.js'
    ],
    function($, SpecHelpers, HtmlUtils) {
        'use strict';

        describe('HtmlUtils', function() {
            beforeEach(function() {
                setFixtures('<div class="test"></div>');
            });

            describe('HtmlSnippet', function() {
                it('can convert to a string', function() {
                    expect(new HtmlUtils.HtmlSnippet('Hello, world').toString()).toBe('Hello, world');
                });
            });

            describe('HTML', function() {
                it('returns an HTML snippet', function() {
                    expect(HtmlUtils.HTML('Hello, world') instanceof HtmlUtils.HtmlSnippet).toBeTruthy();
                });
            });

            describe('ensureHtml', function() {
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
                    var result = HtmlUtils.ensureHtml(input);
                    expect(result instanceof HtmlUtils.HtmlSnippet).toBeTruthy();
                    expect(result.toString()).toEqual(expectedString);
                });
            });

            describe('interpolateHtml', function() {
                it('can interpolate a string with no parameters provided', function() {
                    expect(HtmlUtils.interpolateHtml('Hello, world').toString()).toEqual(
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
                    expect(result instanceof HtmlUtils.HtmlSnippet).toBeTruthy();
                    expect(result.toString()).toEqual(expectedString);
                });
            });

            describe('joinHtml', function() {
                SpecHelpers.withData({
                    'can join a single string': [
                        ['Hello, world'],
                        'Hello, world'
                    ],
                    'escapes characters provided as strings': [
                        ['Rock & Roll'],
                        'Rock &amp; Roll'
                    ],
                    'does not escape HTML snippets': [
                        [HtmlUtils.HTML('<a href="world">world</a>')],
                        '<a href="world">world</a>'
                    ],
                    'can join a mixture of strings and HTML snippets': [
                        ['Rock & Roll', ' all over the ', HtmlUtils.HTML('<a href="world">world</a>')],
                        'Rock &amp; Roll all over the <a href="world">world</a>'
                    ]
                }, function(items, expectedString) {
                    var result = HtmlUtils.joinHtml.apply(null, items);
                    expect(result instanceof HtmlUtils.HtmlSnippet).toBeTruthy();
                    expect(result.toString()).toEqual(expectedString);
                });
            });

            describe('template', function() {
                it('can render a template with no parameters', function() {
                    var template = HtmlUtils.template('Hello, world'),
                        result = template();
                    expect(result instanceof HtmlUtils.HtmlSnippet).toBeTruthy();
                    expect(result.toString()).toEqual('Hello, world');
                });

                it('can render a template with parameters', function() {
                    var template = HtmlUtils.template('Hello, <%- name %>'),
                        result = template({name: 'world'});
                    expect(result instanceof HtmlUtils.HtmlSnippet).toBeTruthy();
                    expect(result.toString()).toEqual('Hello, world');
                });

                it('adds HtmlUtils as an additional context variable for the template', function() {
                    var template = HtmlUtils.template('I love <%= HtmlUtils.ensureHtml("Rock & Roll") %>');
                    expect(template().toString()).toEqual('I love Rock &amp; Roll');
                });

                it('adds StringUtils as an additional context variable for the template', function() {
                    var template = HtmlUtils.template(
                        '<%= StringUtils.interpolate("Hello, {name}", {name: "world"}) %>'
                    );
                    expect(template().toString()).toEqual('Hello, world');
                });
            });

            describe('setHtml', function() {
                SpecHelpers.withData({
                    'HTML escapes text strings': [
                        'Rock & Roll',
                        'Rock &amp; Roll'
                    ],
                    'HTML escapes full HTML strings': [
                        '<a href="world">Rock &amp; Roll</a>',
                        '&lt;a href="world"&gt;Rock &amp;amp; Roll&lt;/a&gt;'
                    ],
                    'does not escape HTML snippets': [
                        HtmlUtils.HTML('<a href="world">Rock &amp; Roll</a>'),
                        '<a href="world">Rock &amp; Roll</a>'
                    ]
                }, function(input, expectedString) {
                    var $element = $('.test');
                    HtmlUtils.setHtml($element, input);
                    expect($element.html()).toEqual(expectedString);
                });
            });

            describe('append', function() {
                SpecHelpers.withData({
                    'HTML escapes text strings': [
                        'Rock & Roll',
                        'Rock &amp; Roll'
                    ],
                    'HTML escapes full HTML strings': [
                        '<a href="world">Rock &amp; Roll</a>',
                        '&lt;a href="world"&gt;Rock &amp;amp; Roll&lt;/a&gt;'
                    ],
                    'does not escape HTML snippets': [
                        HtmlUtils.HTML('<a href="world">Rock &amp; Roll</a>'),
                        '<a href="world">Rock &amp; Roll</a>'
                    ]
                }, function(input, expectedString) {
                    var $element = $('.test');

                    // Appends correctly with no children
                    HtmlUtils.append($element, input);
                    expect($element.html()).toEqual(expectedString);

                    // Appends correctly with a pre-existing child
                    $element.html('<p>Hello, world</p>');
                    HtmlUtils.append($element, input);
                    expect($element.html()).toEqual('<p>Hello, world</p>' + expectedString);
                });
            });

            describe('prepend', function() {
                SpecHelpers.withData({
                    'HTML escapes text strings': [
                        'Rock & Roll',
                        'Rock &amp; Roll'
                    ],
                    'HTML escapes full HTML strings': [
                        '<a href="world">Rock &amp; Roll</a>',
                        '&lt;a href="world"&gt;Rock &amp;amp; Roll&lt;/a&gt;'
                    ],
                    'does not escape HTML snippets': [
                        HtmlUtils.HTML('<a href="world">Rock &amp; Roll</a>'),
                        '<a href="world">Rock &amp; Roll</a>'
                    ]
                }, function(input, expectedString) {
                    var $element = $('.test');

                    // Prepends correctly with no children
                    HtmlUtils.prepend($element, input);
                    expect($element.html()).toEqual(expectedString);

                    // Prepends correctly with a pre-existing child
                    $element.html('<p>Hello, world</p>');
                    HtmlUtils.prepend($element, input);
                    expect($element.html()).toEqual(expectedString + '<p>Hello, world</p>');
                });
            });
        });
    }
);
