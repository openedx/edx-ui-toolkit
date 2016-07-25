define(
    [
        'jquery',
        'sinon',
        '../../utils/spec-helpers/ajax-helpers.js'
    ],
    function($, sinon, AjaxHelpers) {
        'use strict';

        describe('AjaxHelpers', function() {
            var testUrl = 'https://example.com',
                testData = {foo: 'bar', fizz: 'buzz'},
                testQuerystring = $.param(testData);

            describe('fakeServer', function() {
                it('responds with the contents of the first argument', function() {
                    var ajaxSpy = jasmine.createSpy('ajaxSpy');
                    var server = AjaxHelpers.server('foo');

                    $.ajax(testUrl).done(ajaxSpy);
                    server.respond();

                    expect(ajaxSpy).toHaveBeenCalledWith('foo', 'success', jasmine.any(Object));
                });
            });

            describe('fakeRequests', function() {
                it('returns an array that tracks fake requests', function() {
                    // We're really already doing this already in all the tests that call AjaxHelpers.withFakeRequests
                    // down below, but Istanbul doesn't pick those up because they're not "in" a spec...
                    // so do a quick manual test.
                    var requests = AjaxHelpers.requests();

                    $.ajax(testUrl);

                    expect(requests instanceof Array).toBeTruthy();
                    expect(requests.hasOwnProperty('currentIndex')).toBeTruthy();
                    AjaxHelpers.expectRequest(requests, 'GET', testUrl);
                });
            });

            describe('request helper', function() {
                describe('expectRequest', function() {
                    it('verifies a simple bodyless GET', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl);
                        AjaxHelpers.expectRequest(requests, 'GET', testUrl, undefined);
                    }));

                    it('verifies a more complex request', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl, {
                            method: 'POST',
                            data: 'foobar'
                        });
                        AjaxHelpers.expectRequest(requests, 'POST', testUrl, 'foobar');
                    }));
                });

                describe('expectNoRequests', function() {
                    it('verifies 0 requests when none are made', AjaxHelpers.withFakeRequests(function(requests) {
                        AjaxHelpers.expectNoRequests(requests);
                    }));

                    it('verifies 0 requests when all are handled', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl);
                        AjaxHelpers.respondWithError(requests);
                        AjaxHelpers.expectNoRequests(requests);
                    }));
                });

                describe('expectJsonRequest', function() {
                    it('validates a request with JSON payload', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl, {
                            method: 'POST',
                            data: JSON.stringify(testData),
                            contentType: 'application/json'
                        });
                        AjaxHelpers.expectJsonRequest(requests, 'POST', testUrl, testData);
                    }));
                });

                describe('expectRequestURL', function() {
                    it('validates a JSON request made to a URL', AjaxHelpers.withFakeRequests(function(requests) {
                        var path = '/home/category';

                        $.ajax(testUrl + path + '?' + testQuerystring);
                        AjaxHelpers.expectRequestURL(requests, path, testData);
                    }));
                });

                describe('expectPostRequest', function() {
                    it('validates a non-JSON POST request', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl, {
                            method: 'POST',
                            data: testQuerystring
                        });
                        AjaxHelpers.expectPostRequest(requests, testUrl, testQuerystring);
                    }));
                });

                describe('skipResetRequest', function() {
                    it('verifies request was cancelled', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl).abort();
                        AjaxHelpers.skipResetRequest(requests);
                    }));
                });
            });

            describe('response helper', function() {
                var ajaxSpy;

                beforeEach(function() {
                    ajaxSpy = jasmine.createSpy('ajaxSpy');
                });

                describe('respondWithJson', function() {
                    it('responds with JSON and code 200', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl).done(ajaxSpy);
                        AjaxHelpers.respondWithJson(requests, testData);

                        expect(ajaxSpy).toHaveBeenCalledWith(testData, 'success', jasmine.objectContaining({
                            responseJSON: testData,
                            status: 200
                        }));
                    }));
                });

                describe('respondWithError', function() {
                    it('responds with JSON and code 500 by default', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl).fail(ajaxSpy);
                        AjaxHelpers.respondWithError(requests, null, testData);

                        expect(ajaxSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                            responseJSON: testData,
                            status: 500
                        }), 'error', 'Internal Server Error');
                    }));

                    it('responds with JSON and custom code', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl).fail(ajaxSpy);
                        AjaxHelpers.respondWithError(requests, 555, testData);

                        expect(ajaxSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                            responseJSON: testData,
                            status: 555
                        }), 'error', undefined);
                    }));
                });

                describe('respondWithTextError', function() {
                    it('responds with text and code 500 by default', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl).fail(ajaxSpy);
                        AjaxHelpers.respondWithTextError(requests, null, 'foobar');

                        expect(ajaxSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                            responseText: 'foobar',
                            status: 500
                        }), 'error', 'Internal Server Error');
                    }));

                    it('responds with text and custom code', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl).fail(ajaxSpy);
                        AjaxHelpers.respondWithTextError(requests, 555, 'foobar');

                        expect(ajaxSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                            responseText: 'foobar',
                            status: 555
                        }), 'error', undefined);
                    }));
                });

                describe('respondWithNoContent', function() {
                    it('responds with no body and code 204', AjaxHelpers.withFakeRequests(function(requests) {
                        $.ajax(testUrl).done(ajaxSpy);
                        AjaxHelpers.respondWithNoContent(requests);

                        expect(ajaxSpy).toHaveBeenCalledWith(undefined, 'nocontent', jasmine.objectContaining({
                            responseJSON: {},
                            status: 204
                        }));
                    }));
                });
            });
        });
    }
);
