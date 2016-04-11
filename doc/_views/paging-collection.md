---
title: pagination/paging-collection
requirePath: edx-ui-toolkit/js/pagination/paging-collection
githubPath: blob/master/src/js/pagination/paging-collection.js
viewClass: view
---

# Global





* * *

## Class: PagingCollection
A generic server paging collection.

By default this collection is designed to work with Django Rest
Framework APIs, but can be configured to work with others. There is
support for ascending or descending sort on a particular field, as
well as filtering on a field. While the backend API may use either
zero or one indexed page numbers, this collection uniformly exposes a
one indexed interface to make consumption easier for views.

Subclasses may want to override the following properties:
     - url (string): The base url for the API endpoint.
     - state (object): Object to overrride default state values
       provided to Backbone.paginator.
     - queryParams (object): Specifies Query parameters for the API
       call using the Backbone.paginator API.  In the case of built-
       in Backbone.paginator state keys, this maps those state keys
       to query parameter keys.  queryParams can also map query
       parameter keys to functions providing values for such keys.
       Subclasses may add entries as necessary. By default,
       'sort_order' is the query parameter used for sorting, with
       values of 'asc' for increasing sort and 'desc' for decreasing
       sort.

### PagingCollection.parseState() 

Parses state from the server response.  Used only by
backbone.paginator.


### PagingCollection.getPageNumber() 

Returns the current page number as if numbering starts on
page one, regardless of the indexing of the underlying
server API.


### PagingCollection.setPage(page) 

Sets the current page of the collection. Page is assumed
to be one indexed, regardless of the indexing of the
underlying server API. If there is an error fetching the
page, the Backbone 'error' event is triggered and the
page does not change. A 'page_changed' event is triggered
on a successful page change.

**Parameters**

**page**: , one-indexed page to change to


### PagingCollection.refresh() 

Refreshes the collection if it has been marked as stale.

**Returns**: `promise`, Returns a promise representing the
    refresh.

### PagingCollection.hasNextPage() 

Returns true if the collection has a next page, false
otherwise.


### PagingCollection.hasPreviousPage() 

Returns true if the collection has a previous page, false
otherwise.


### PagingCollection.nextPage() 

Moves the collection to the next page if it exists.


### PagingCollection.previousPage() 

Moves the collection to the previous page if it exists.


### PagingCollection.registerSortableField(fieldName, displayName) 

Adds the given field to the list of fields that can be
sorted on.

**Parameters**

**fieldName**: , name of the field for the server API

**displayName**: , name of the field to display to the
    user


### PagingCollection.registerFilterableField(fieldName, displayName) 

Adds the given field to the list of fields that can be
filtered on.

**Parameters**

**fieldName**: , name of the field for the server API

**displayName**: , name of the field to display to the
    user


### PagingCollection.addField(fields, fieldName, displayName) 

For internal use only. Adds the given field to the given
collection of fields.

**Parameters**

**fields**: , object of existing fields

**fieldName**: , name of the field for the server API

**displayName**: , name of the field to display to the
    user


### PagingCollection.sortDisplayName() 

Returns the display name of the field that the collection
is currently sorted on.


### PagingCollection.filterDisplayName(fieldName) 

Returns the display name of a filterable field.

**Parameters**

**fieldName**: , querystring parameter name for the
    filterable field


### PagingCollection.setSortField(fieldName, toggleDirection) 

Sets the field to sort on and marks the collection as
stale.

**Parameters**

**fieldName**: , name of the field to sort on

**toggleDirection**: , if true, the sort direction is
    toggled if the given field was already set


### PagingCollection.sortDirection() 

Returns the direction of the current sort.


### PagingCollection.setSortDirection(direction) 

Sets the direction of the sort and marks the collection
as stale.  Assumes (and requires) that the sort key has
already been set.

**Parameters**

**direction**: , either ASCENDING or DESCENDING from
    PagingCollection.SortDirection.


### PagingCollection.flipSortDirection() 

Flips the sort order.


### PagingCollection.hasRegisteredFilterField(fieldName) 

Returns whether this collection has defined a given
filterable field.

**Parameters**

**fieldName**: , querystring parameter name for the
    filterable field


### PagingCollection.getActiveFilterFields() 

Gets an object of currently active (applied) filters.

**Returns**: `Object`, An object mapping the names of
    currently active filter fields to their values.

### PagingCollection.getFilterFieldValue() 

Gets the value of the given filter field.

**Returns**: `String`, the current value of the requested
    filter field.  null or undefined means that the
    filter field is not active.

### PagingCollection.setFilterField(fieldName, value) 

Sets a filter field to a given value and marks the
collection as stale.

**Parameters**

**fieldName**: , querystring parameter name for the
    filterable field

**value**: , value for the filterable field


### PagingCollection.unsetFilterField(fieldName) 

Unsets a filterable field and marks the collection as
stale.

**Parameters**

**fieldName**: , querystring parameter name for the
    filterable field


### PagingCollection.unsetAllFilterFields() 

Unsets all of the collections filterable fields and marks
the collection as stale.


### PagingCollection.setSearchString(searchString) 

Sets the string to use for a text search and marks the
collection as stale.

**Parameters**

**searchString**: , A string to search on, or null if no
    search is to be applied.


### PagingCollection.unsetSearchString() 

Unsets the string to use for a text search and marks the
collection as stale.




* * *










