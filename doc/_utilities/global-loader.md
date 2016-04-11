---
title: utils/global-loader
requirePath: edx-ui-toolkit/js/utils/global-loader
githubPath: blob/master/src/js/utils/global-loader.js
viewClass: utility
---

# GlobalLoader

An AMD loader that installs modules into the global edx namespace.



* * *

### GlobalLoader.defineAs(name, path) 

Define a module that can be accessed globally in the edx namespace.

**Parameters**

**name**: `string`, The name by which the module will be accessed.

**path**: `string`, The module's path.

**Returns**: `function`, A function that will create the module.


### GlobalLoader.clear() 

Clears all registered modules.

Note: this function is only provided for unit testing.




* * *










