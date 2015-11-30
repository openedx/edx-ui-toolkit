Part of [edX code](http://code.edx.org/)

edX UI Toolkit [![Build Status](https://travis-ci.org/edx/edx-ui-toolkit.svg?branch=master)](https://travis-ci.org/edx/edx-ui-toolkit)
==============

Getting Started
---------------
1. Get the code (e.g. clone the repository).
2. Install the Node requirements:

        $ npm install

3. Install Bower requirements:

        $ bower install

Linting
-------

        $ gulp lint

Tests
-----

To run tests in headless mode:

        $ gulp test

To run tests in debug mode:

        $ gulp test_debug

Once tests are running in debug mode, open this URL:

        http://localhost:9009/debug.html
