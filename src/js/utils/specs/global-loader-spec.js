/* global $, _ */
// eslint-disable-next-line import/no-amd
define(
    [
        'edx-ui-toolkit/js/utils/global-loader'
    ],
    function (GlobalLoader) {
        'use strict';

        describe('GlobalLoader', function () {
            beforeEach(function () {
                GlobalLoader.defineAs('TestModule', 'js/test-module')(
                    [],
                    function () {
                        return { name: 'TestModule' };
                    }
                );
            });

            it('installs a module into the edx namespace', function () {
                expect(edx.TestModule).toBeDefined();
                expect(edx.TestModule.name).toBe('TestModule');
            });

            it('handles standard libraries', function () {
                GlobalLoader.defineAs('TestModule2', 'js/test-module2')(
                    ['jquery', 'underscore'],
                    function ($, _) {
                        return { name: 'TestModule2', $: $, _: _ };
                    }
                );
                expect(edx.TestModule2).toBeDefined();
                expect(edx.TestModule2.$).toBe($);
                expect(edx.TestModule2._).toBe(_);
            });

            it('loads dependent modules', function () {
                GlobalLoader.defineAs('TestModule2', 'js/test-module2')(
                    ['js/test-module'],
                    function (TestModule) {
                        return { name: 'TestModule2', dependsOn: TestModule };
                    }
                );

                expect(edx.TestModule2).toBeDefined();
                expect(edx.TestModule2.name).toBe('TestModule2');
                expect(edx.TestModule2.dependsOn).toBe(edx.TestModule);
            });
        });
    }
);
