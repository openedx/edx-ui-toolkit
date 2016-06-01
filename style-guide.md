# edX JavaScript Conventions

# TODO

I'm looking for widespread agreement on everything contained in this document!
In particular, I'd love feedback on the [Goals](#goals), [Style](#style), and
[Conventions](#conventions) sections.

Here are a few things that would be awesome to have:
- [ ] define and link to a jshint/jscs/eslint config
- [ ] clarify path towards ES2015

## Motivation

Code conventions are important.  It helps us intuitively approach new code,
revisit old code, and share code with others.

## Goals

We hope to write JavaScript which is:

1. Legible
2. Friendly
3. Predictable
4. Semantic

## About

This guide is split up into two sections - [Style](#style) and
[Conventions](#conventions).  The style section addresses aesthetic topics,
while the conventions section addresses topics that have more semantic
significance.

## Note: ECMAScript Version

Currently, edX only supports ES5.  In order to implement modules, we use AMD by
way of [RequireJS](http://requirejs.org/).  We are moving towards ES2015
however, and this guide will be updated when we get there.

## Style
### Indentation

All JavaScript should be indented with 4 spaces.  edX uses this standard
throughout our Python, HTML, SASS/CSS, and JavaScript code.

e.g.

```javascript
function sayHello (name) {
    return 'Hello, ' + name;
}
```

### Semicolons

Use them!

### Line Length

Break lines at `120` columns.

### Strings

Use single quotes for string literals, unless the string itself contains single
quotes.

e.g.

```javascript
var edX = 'edX',
    thisGuide = "edX's JavaScript Style Guide";
```

### Comments

If code does not read clearly on its own, consider breaking it up into smaller
pieces. If things are still not clear, add a descriptive comment in the form of
full-sentence(s).

### Variables

We like to write our code to reflect the fact that JavaScript hoists `var`
declarations to the top-level environment of the current function. Therefore
declare all variables for a particular function at the start of the function.

e.g.

```javascript
var enrollUserInCourse = function (username, courseId) {
    var userModel,
        courseModel;

    if (username) {
        userModel = new UserModel({username: username});
    } else {
        throw new Error('No user specified');
    }

    if (courseId) {
        courseModel = new CourseModel({courseId: courseId});
    } else {
        throw new Error('No course specified');
    }

    courseModel.enroll(userModel);
}
```

### Brackets, Braces, and Parentheses

"Cuddle" the second keyword of `if/else`, `do/while`, and `try/catch` statements
onto the previous closing brace.

e.g.

```javascript
if (/* condition */) {
    // ...
} else { // <- cuddle here!
    // ...
}

do {
    // ...
} while (/* ... */); // <- cuddle here!

try {
    // ...
} catch (error) { // <- cuddle here!
    // ...
}
```

Leave spaces around parenthesized expressions in control structures and function
declarations.

e.g.

```javascript
function isNaivelyEqual (arg1, arg2) {
    if (arg1 === arg2) {
        return true;
    }
    return false;
}
```

## Conventions
### Documentation

Document all modules, constructors, functions, and methods with
[JSDoc](http://usejsdoc.org/) comments.

### Modules

We currently use AMD modules implemented by [RequireJS](http://requirejs.org/).

### Strict Mode

Place `'use strict';` at the top-level of all modules, including tests.

### Naming

Give variables, constructors, modules, and functions good names.  Names should
be short and descriptive, but always prioritize legibility over shortness.
