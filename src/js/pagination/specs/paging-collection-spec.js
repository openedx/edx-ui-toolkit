define(['jquery',
        'backbone',
        'underscore',
        'URI',
        '../paging-collection.js',
        '../../utils/spec-helpers/ajax-helpers.js',
        '../../utils/spec-helpers/spec-helpers.js'
    ],
    function ($, Backbone, _, URI, PagingCollection, AjaxHelpers, SpecHelpers) {
        'use strict';

        describe('PagingCollection', function () {
            var collection;
            var server = {
                isZeroIndexed: false,
                count: 43,
                respond: function (requests) {
                    var params = (new URI(requests[requests.length - 1].url)).query(true),
                        page = parseInt(params.page, 10),
                        page_size = parseInt(params.page_size, 10),
                        page_count = Math.ceil(this.count / page_size);

                    // Make zeroPage consistently start at zero for ease of calculation
                    var zeroPage = page - (this.isZeroIndexed ? 0 : 1);
                    if (zeroPage < 0 || zeroPage > page_count) {
                        AjaxHelpers.respondWithError(requests, 404, {}, requests.length - 1);
                    } else {
                        AjaxHelpers.respondWithJson(requests, {
                            count: this.count,
                            current_page: page,
                            num_pages: page_count,
                            start: zeroPage * page_size,
                            results: []
                        }, requests.length - 1);
                    }
                }
            };
            var getUrlParams = function (request) {
                return (new URI(request.url)).query(true);
            };
            var assertQueryParams = function (requests, params) {
                var urlParams = getUrlParams(requests[requests.length - 1]);
                _.each(params, function (value, key) {
                    expect(urlParams[key]).toBe(value);
                });
            };

            beforeEach(function () {
                collection = new PagingCollection([], {state: {pageSize: 10}});
                collection.url = '/test';
                server.isZeroIndexed = false;
                server.count = 43;
            });

            it('correctly merges state and queryParams in the extend statement', function () {
                var MyPagingCollection, newCollection;
                MyPagingCollection = PagingCollection.extend({
                    state: {pageSize: 25},
                    queryParams: {pageSize: 'per_page'}
                });
                newCollection = new MyPagingCollection([]);
                expect(newCollection.state.pageSize).toBe(25);
                expect(newCollection.state.firstPage).toBe(1);
                expect(newCollection.queryParams.pageSize).toBe('per_page');
                expect(newCollection.queryParams.currentPage).toBe('page');
            });

            it('can register sortable fields', function () {
                collection.registerSortableField('test_field', 'Test Field');
                expect('test_field' in collection.sortableFields).toBe(true);
                expect(collection.sortableFields.test_field.displayName).toBe('Test Field');
            });

            it('can register filterable fields', function () {
                collection.registerFilterableField('test_field', 'Test Field');
                expect('test_field' in collection.filterableFields).toBe(true);
                expect(collection.filterableFields.test_field.displayName).toBe('Test Field');
            });

            it('can set the sort field', AjaxHelpers.requests(
                function (requests) {
                    collection.registerSortableField('test_field', 'Test Field');
                    collection.setSortField('test_field', false);
                    collection.refresh();
                    assertQueryParams(requests, {'sort_order': 'asc'});
                    expect(collection.state.sortKey).toBe('test_field');
                    expect(collection.sortDisplayName()).toBe('Test Field');
                }
            ));

            it('can tell the current sort direction', function () {
                collection.setSortDirection(PagingCollection.SortDirection.ASCENDING);
                expect(collection.sortDirection()).toBe(PagingCollection.SortDirection.ASCENDING);
                collection.setSortDirection(PagingCollection.SortDirection.DESCENDING);
                expect(collection.sortDirection()).toBe(PagingCollection.SortDirection.DESCENDING);
            });

            it('can set a filter field', AjaxHelpers.requests(
                function (requests) {
                    collection.registerFilterableField('test_field', 'Test Field');
                    collection.setFilterField('test_field', 'test_value');
                    collection.refresh();
                    assertQueryParams(requests, {'test_field': 'test_value'});
                    expect(collection.filterDisplayName('test_field')).toBe('Test Field');
                    expect(collection.filterableFields.test_field.value).toBe('test_value');
                }
            ));

            it('can set many filter fields', AjaxHelpers.requests(
                function (requests) {
                    collection.registerFilterableField('test_field_1', 'Test Field 1');
                    collection.registerFilterableField('test_field_2', 'Test Field 2');
                    collection.setFilterField('test_field_1', 'test_value_1');
                    collection.setFilterField('test_field_2', 'test_value_2');
                    collection.refresh();
                    assertQueryParams(requests, {test_field_1: 'test_value_1', test_field_2: 'test_value_2'});
                    expect(collection.filterDisplayName('test_field_1')).toBe('Test Field 1');
                    expect(collection.filterDisplayName('test_field_2')).toBe('Test Field 2');
                    expect(collection.filterableFields.test_field_1.value).toBe('test_value_1');
                    expect(collection.filterableFields.test_field_2.value).toBe('test_value_2');
                }
            ));

            it('can unset a filter field', AjaxHelpers.requests(function (requests) {
                collection.registerFilterableField('test_field', 'Test Field');
                collection.setFilterField('test_field', 'test_value');
                collection.refresh();
                assertQueryParams(requests, {test_field: 'test_value'});
                collection.unsetAllFilterFields();
                collection.refresh();
                expect('test_field' in getUrlParams(requests[requests.length - 1])).not.toBe(true);
            }));

            it('can unset all filter fields', AjaxHelpers.requests(function (requests) {
                collection.registerFilterableField('test_field_1', 'Test Field 1');
                collection.registerFilterableField('test_field_2', 'Test Field 2');
                collection.setFilterField('test_field_1', 'test_value_1');
                collection.setFilterField('test_field_2', 'test_value_2');
                collection.refresh();
                assertQueryParams(requests, {test_field_1: 'test_value_1', test_field_2: 'test_value_2'});
                collection.unsetAllFilterFields();
                collection.refresh();
                expect('test_field_1' in getUrlParams(requests[requests.length - 1])).not.toBe(true);
                expect('test_field_2' in getUrlParams(requests[requests.length - 1])).not.toBe(true);
            }));

            it('can return the currently active filter fields', function () {
                collection.registerFilterableField('test_field_1', 'Test Field 1');
                collection.registerFilterableField('test_field_2', 'Test Field 2');
                collection.registerFilterableField('test_field_3', 'Test Field 3');
                collection.setFilterField('test_field_1', 'test_value_1');
                collection.setFilterField('test_field_3', 'test_value_3');
                expect(collection.getActiveFilterFields())
                    .toEqual({test_field_1: 'test_value_1', test_field_3: 'test_value_3'});
            });

            it('can get the value of a particular filter field', function () {
                collection.registerFilterableField('test_field_1', 'Test Field 1');
                collection.registerFilterableField('test_field_2', 'Test Field 2');
                collection.setFilterField('test_field_1', 'test_value_1');
                expect(collection.getFilterFieldValue('test_field_1')).toEqual('test_value_1');
                collection.unsetFilterField('test_field_1');
                expect(collection.getFilterFieldValue('test_field_1')).toBe(undefined);
                expect(collection.getFilterFieldValue('test_field_2')).toBe(undefined);
                expect(collection.getFilterFieldValue('no_such_field')).toBe(undefined);
            });

            it('can set the sort direction', AjaxHelpers.requests(
                function (requests) {
                    collection.setSortField('test_field');
                    collection.setSortDirection(PagingCollection.SortDirection.DESCENDING);
                    collection.refresh();
                    assertQueryParams(requests, {'sort_order': PagingCollection.SortDirection.DESCENDING});
                    expect(collection.sortDirection()).toBe(PagingCollection.SortDirection.DESCENDING);
                    collection.setSortDirection(PagingCollection.SortDirection.ASCENDING);
                    collection.refresh();
                    assertQueryParams(requests, {'sort_order': PagingCollection.SortDirection.ASCENDING});
                    expect(collection.sortDirection()).toBe(PagingCollection.SortDirection.ASCENDING);
                }
            ));

            it('can flip the sort direction', AjaxHelpers.requests(
                function (requests) {
                    collection.setSortField('test_field');
                    collection.refresh();
                    assertQueryParams(requests, {'sort_order': PagingCollection.SortDirection.ASCENDING});
                    collection.flipSortDirection();
                    collection.refresh();
                    assertQueryParams(requests, {'sort_order': PagingCollection.SortDirection.DESCENDING});
                }
            ));

            it('can toggle the sort direction when setting the sort field', function () {
                collection.registerSortableField('test_field', 'Test Field');
                collection.registerSortableField('test_field_2', 'Test Field 2');
                collection.setSortField('test_field', true);
                expect(collection.sortDirection()).toBe(PagingCollection.SortDirection.DESCENDING);
                collection.setSortField('test_field', true);
                expect(collection.sortDirection()).toBe(PagingCollection.SortDirection.ASCENDING);
                collection.setSortField('test_field', true);
                expect(collection.sortDirection()).toBe(PagingCollection.SortDirection.DESCENDING);
                collection.setSortField('test_field_2');
                expect(collection.sortDirection()).toBe(PagingCollection.SortDirection.DESCENDING);
                collection.setSortField('test_field_2', true);
                expect(collection.sortDirection()).toBe(PagingCollection.SortDirection.ASCENDING);
            });

            it('can set and unset the search string', AjaxHelpers.requests(function (requests) {
                collection.setSearchString('testString');
                collection.refresh();
                assertQueryParams(requests, {'text_search': 'testString'});
                collection.unsetSearchString();
                collection.refresh();
                expect('text_search' in getUrlParams(requests[requests.length - 1])).not.toBe(true);
            }));

            it('does not refresh itself if the search string is unchanged',
               AjaxHelpers.requests(function (requests) {
                   var testString = 'testString';
                   collection.setSearchString(testString);
                   collection.refresh();
                   server.respond(requests);
                   collection.setSearchString(testString);
                   collection.refresh();
                   expect(requests.length).toEqual(1);
               })
              );

            SpecHelpers.withData({
                'queries with page, page_size, and sort_order parameters when zero indexed': [true, 2],
                'queries with page, page_size, and sort_order parameters when one indexed': [false, 3]
            }, AjaxHelpers.requests(function (isZeroIndexed, page, requests) {
                collection = new PagingCollection([], {state: {firstPage: isZeroIndexed ? 0 : 1, pageSize: 5}});
                collection.url = '/test';
                collection.setSortField('test_field');
                collection.setPage(3);
                assertQueryParams(requests, {
                    'page': page.toString(), 'page_size': '5', 'order_by': 'test_field', 'sort_order': 'asc'
                });
            }));

            it('has instance-unique filterableFields and sortablefields', function () {
                var otherCollection = new PagingCollection([], {state: {pageSize: 10}});
                collection.registerFilterableField('foo', 'foo');
                collection.setFilterField('foo', 'bar');
                collection.registerSortableField('quux', 'quux');
                expect(collection.filterableFields).not.toBe(otherCollection.filterableFields);
                expect(collection.sortableFields).not.toBe(otherCollection.sortableFields);
            });

            SpecHelpers.withConfiguration({
                'using a zero indexed collection': [true],
                'using a one indexed collection': [false]
            }, function (isZeroIndexed) {
                collection.state.firstPage = isZeroIndexed ? 0 : 1;
                server.isZeroIndexed = isZeroIndexed;
            }, function () {
                describe('setPage', function() {
                    it('triggers a reset event when the page changes successfully',
                       AjaxHelpers.requests(function (requests) {
                        var resetTriggered = false;
                        collection.on('reset', function () { resetTriggered = true; });
                        collection.setPage(3);
                        server.respond(requests);
                        expect(resetTriggered).toBe(true);
                       })
                      );

                    it('triggers an error event when the requested page is out of range',
                       AjaxHelpers.requests(function (requests) {
                        var errorTriggered = false;
                        collection.on('error', function () { errorTriggered = true; });
                        collection.setPage(17);
                        server.respond(requests);
                        expect(errorTriggered).toBe(true);
                       })
                      );

                    it('triggers an error event if the server responds with a 500',
                       AjaxHelpers.requests(function (requests) {
                        var errorTriggered = false;
                        collection.on('error', function () { errorTriggered = true; });
                        collection.setPage(2);
                        expect(collection.getPageNumber()).toBe(2);
                        server.respond(requests);
                        collection.setPage(3);
                        AjaxHelpers.respondWithError(requests, 500, {}, requests.length - 1);
                        expect(errorTriggered).toBe(true);
                        expect(collection.getPageNumber()).toBe(2);
                       })
                      );
                });

                describe('getPageNumber', function () {
                    it('returns the correct page', AjaxHelpers.requests(function (requests) {
                        collection.setPage(1);
                        server.respond(requests);
                        expect(collection.getPageNumber()).toBe(1);
                        collection.setPage(3);
                        server.respond(requests);
                        expect(collection.getPageNumber()).toBe(3);
                    }));
                });

                describe('hasNextPage', function () {
                    SpecHelpers.withData(
                        {
                            'returns false for a single page': [1, 3, false],
                            'returns true on the first page': [1, 43, true],
                            'returns true on the penultimate page': [4, 43, true],
                            'returns false on the last page': [5, 43, false]
                        },
                        AjaxHelpers.requests(function (page, count, result, requests) {
                            server.count = count;
                            collection.setPage(page);
                            server.respond(requests);
                            expect(collection.hasNextPage()).toBe(result);
                        })
                    );
                });

                describe('hasPreviousPage', function () {
                    SpecHelpers.withData(
                        {
                            'returns false for a single page': [1, 3, false],
                            'returns true on the last page': [5, 43, true],
                            'returns true on the second page': [2, 43, true],
                            'returns false on the first page': [1, 43, false]
                        },
                        AjaxHelpers.requests(function (page, count, result, requests) {
                            server.count = count;
                            collection.setPage(page);
                            server.respond(requests);
                            expect(collection.hasPreviousPage()).toBe(result);
                        })
                    );
                });

                describe('nextPage', function () {
                    SpecHelpers.withData(
                        {
                            'advances to the next page': [2, 43, 3],
                            'silently fails on the last page': [5, 43, 5]
                        },
                        AjaxHelpers.requests(function (page, count, newPage, requests) {
                            server.count = count;
                            collection.setPage(page);
                            server.respond(requests);
                            expect(collection.getPageNumber()).toBe(page);
                            collection.nextPage();
                            if (requests.length > 1) {
                                server.respond(requests);
                            }
                            expect(collection.getPageNumber()).toBe(newPage);
                        })
                    );
                });

                describe('previousPage', function () {
                    SpecHelpers.withData(
                        {
                            'moves to the previous page': [2, 43, 1],
                            'silently fails on the first page': [1, 43, 1]
                        },
                        AjaxHelpers.requests(function (page, count, newPage, requests) {
                            server.count = count;
                            collection.setPage(page);
                            server.respond(requests);
                            expect(collection.getPageNumber()).toBe(page);
                            collection.previousPage();
                            if (requests.length > 1) {
                                server.respond(requests);
                            }
                            expect(collection.getPageNumber()).toBe(newPage);
                        })
                    );
                });
            });
        });
    }
);
