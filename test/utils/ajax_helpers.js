define(['sinon', 'underscore', 'URI'], function(sinon, _, URI) {
    'use strict';

    var fakeRequests, expectRequest, expectJsonRequest, expectPostRequest, expectRequestURL,
        respondWithJson, respondWithError, respondWithTextError, respondWithNoContent;

    /* These utility methods are used by Jasmine tests to create a mock server or
     * get reference to mock requests. In either case, the cleanup (restore) is done with
     * an after function.
     *
     * This pattern is being used instead of the more common beforeEach/afterEach pattern
     * because we were seeing sporadic failures in the afterEach restore call. The cause of the
     * errors were that one test suite was incorrectly being linked as the parent of an unrelated
     * test suite (causing both suites' afterEach methods to be called). No solution for the root
     * cause has been found, but initializing sinon and cleaning it up on a method-by-method
     * basis seems to work. For more details, see STUD-1264.
     */

    /**
     * Get a reference to the mocked server, and respond
     * to all requests with the specified statusCode.
     *
     * TODO (pfogg): removing this for now. Jasmine 2.0 removes the
     * `after` hook (as well as the ability to get a reference to the
     * current spec). As a result this function is broken, and it's
     * not used anywhere regardless. Fixing this is likely as simple
     * as converting it to work as a decorator/HOF like `fakeRequests`
     * below.
     */
    // fakeServer = function (that, response) {
    //     var server = sinon.fakeServer.create();
    //     that.after(function() {
    //         server.restore();
    //     });
    //     server.respondWith(response);
    //     return server;
    // };

    /**
     * Keep track of all requests to a fake server, and call `spec`
     * with a reference to the server. Allows tests to respond to
     * individual requests.
     */
    fakeRequests = function (spec) {
        return function () {
            var requests = [],
                xhr = sinon.useFakeXMLHttpRequest(),
                args = Array.prototype.slice.call(arguments);
            xhr.onCreate = function(request) {
                requests.push(request);
            };
            spec.apply(null, args.concat([requests]));
            xhr.restore();
        };
    };

    expectRequest = function(requests, method, url, body, requestIndex) {
        var request;
        if (_.isUndefined(requestIndex)) {
            requestIndex = requests.length - 1;
        }
        request = requests[requestIndex];
        expect(request.url).toEqual(url);
        expect(request.method).toEqual(method);
        expect(request.requestBody).toEqual(body);
    };

    expectJsonRequest = function(requests, method, url, jsonRequest, requestIndex) {
        var request;
        if (_.isUndefined(requestIndex)) {
            requestIndex = requests.length - 1;
        }
        request = requests[requestIndex];
        expect(request.url).toEqual(url);
        expect(request.method).toEqual(method);
        expect(JSON.parse(request.requestBody)).toEqual(jsonRequest);
    };

    /**
     * Expect that a JSON request be made with the given URL and parameters.
     * @param requests The collected requests
     * @param expectedUrl The expected URL excluding the parameters
     * @param expectedParameters An object representing the URL parameters
     * @param requestIndex An optional index for the request (by default, the last request is used)
     */
    expectRequestURL = function(requests, expectedUrl, expectedParameters, requestIndex) {
        var request, parameters;
        if (_.isUndefined(requestIndex)) {
            requestIndex = requests.length - 1;
        }
        request = requests[requestIndex];
        expect(new URI(request.url).path()).toEqual(expectedUrl);
        parameters = new URI(request.url).query(true);
        delete parameters._;  // Ignore the cache-busting argument
        expect(parameters).toEqual(expectedParameters);
    };

    /**
     * Intended for use with POST requests using application/x-www-form-urlencoded.
     */
    expectPostRequest = function(requests, url, body, requestIndex) {
        var request;
        if (_.isUndefined(requestIndex)) {
            requestIndex = requests.length - 1;
        }
        request = requests[requestIndex];
        expect(request.url).toEqual(url);
        expect(request.method).toEqual('POST');
        expect(_.difference(request.requestBody.split('&'), body.split('&'))).toEqual([]);
    };

    respondWithJson = function(requests, jsonResponse, requestIndex) {
        if (_.isUndefined(requestIndex)) {
            requestIndex = requests.length - 1;
        }
        requests[requestIndex].respond(200,
            { 'Content-Type': 'application/json' },
            JSON.stringify(jsonResponse));
    };

    respondWithError = function(requests, statusCode, jsonResponse, requestIndex) {
        if (_.isUndefined(requestIndex)) {
            requestIndex = requests.length - 1;
        }
        if (_.isUndefined(statusCode)) {
            statusCode = 500;
        }
        if (_.isUndefined(jsonResponse)) {
            jsonResponse = {};
        }
        requests[requestIndex].respond(statusCode,
            { 'Content-Type': 'application/json' },
            JSON.stringify(jsonResponse)
        );
    };

    respondWithTextError = function(requests, statusCode, textResponse, requestIndex) {
        if (_.isUndefined(requestIndex)) {
            requestIndex = requests.length - 1;
        }
        if (_.isUndefined(statusCode)) {
            statusCode = 500;
        }
        if (_.isUndefined(textResponse)) {
            textResponse = '';
        }
        requests[requestIndex].respond(statusCode,
            { 'Content-Type': 'text/plain' },
            textResponse
        );
    };

    respondWithNoContent = function(requests, requestIndex) {
        if (_.isUndefined(requestIndex)) {
            requestIndex = requests.length - 1;
        }
        requests[requestIndex].respond(204,
            { 'Content-Type': 'application/json' });
    };

    return {
        requests: fakeRequests,
        expectRequest: expectRequest,
        expectJsonRequest: expectJsonRequest,
        expectPostRequest: expectPostRequest,
        expectRequestURL: expectRequestURL,
        respondWithJson: respondWithJson,
        respondWithError: respondWithError,
        respondWithTextError: respondWithTextError,
        respondWithNoContent: respondWithNoContent
    };
});