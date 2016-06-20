define(
    [
        '../../utils/spec-helpers/spec-helpers.js',
        '../string-utils.js'
    ],
    function(SpecHelpers, StringUtils) {
        'use strict';

        describe('StringUtils', function() {
            describe('interpolate', function() {
                it('can interpolate a string with no parameters provided', function() {
                    expect(StringUtils.interpolate('Hello, world')).toEqual(
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
                    ]
                }, function(template, options, expectedString) {
                    var result = StringUtils.interpolate(template, options);
                    expect(result).toEqual(expectedString);
                });
            });
        });
    }
);
