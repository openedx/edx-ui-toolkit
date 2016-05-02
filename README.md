# edX UI Toolkit

A JavaScript toolkit for building edX user interfaces.

[![GitHub version](https://badge.fury.io/gh/edx%2Fedx-ui-toolkit.svg)](https://badge.fury.io/gh/edx%2Fedx-ui-toolkit)
[![npm version](https://badge.fury.io/js/edx-ui-toolkit.svg)](https://badge.fury.io/js/edx-ui-toolkit)
[![Bower version](https://badge.fury.io/bo/edx-ui-toolkit.svg)](https://badge.fury.io/bo/edx-ui-toolkit)
[![CoverageStatus](https://img.shields.io/coveralls/edx/edx-ui-toolkit.svg)](https://coveralls.io/r/edx/edx-ui-toolkit?branch=master)

- - -

## Table of Contents

1. [Overview](#overview)
2. [License](#license)
3. [Contributions](#contributions)
5. [Getting Started](#getting-started)
6. [Linting](#linting)
7. [Tests](#tests)
8. [Documentation](#documentation)

- - -

## Overview

This library contains the following:

* Backbone views to implement patterns as defined by the edX Pattern Library: http://ux.edx.org/
* Utility methods to simplify the creation and testing of user interfaces

## License

The code in this repository uses the Apache 2.0 license unless otherwise
noted. Please see the [LICENSE file](https://github.com/edx/edx-ui-toolkit/blob/master/LICENSE) for details.

## Contributions

Contributions are very welcome. The easiest way is to fork this repo, and then
make a pull request from your fork. The first time you make a pull request, you
may be asked to sign a Contributor Agreement.

Please refer to our [contributor guidelines](https://github.com/edx/edx-ui-toolkit/blob/master/CONTRIBUTING.md) 
for important additional information.

## Getting Started

1. Get the code (e.g. clone the repository).
2. Install the Node requirements:

        $ npm install

## Linting

        $ gulp lint

## Tests

To run tests in headless mode:

        $ gulp test

To run tests in debug mode:

        $ gulp test-debug

Once tests are running in debug mode, open this URL:

        http://localhost:9009/debug.html

## Documentation

The UI Toolkit has auto-generated documentation available here: [http://ui-toolkit.edx.org/](http://ui-toolkit.edx.org/).

To generate this documentation, run the following command:

        $ gulp doc
        
To upload a preview of the documentation to S3:
        
        $ gulp preview

To update the hosted documentation:
        
        $ gulp doc-publish
