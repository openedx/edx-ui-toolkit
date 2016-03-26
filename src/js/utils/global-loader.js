/**
 * An AMD loader that installs modules into the global edx namespace.
 */
(function() {
    'use strict';

    window.edx = window.edx || {};

    window.edx.GlobalLoader = (function() {
        var registeredModules = {};

        // Register standard libraries
        registeredModules.jquery = $;
        registeredModules.underscore = _;

        return {
            /**
             * Define a module that can be accessed globally in the edx namespace.
             *
             * @param {string} name The name by which the module will be accessed.
             * @param {string} path The module's path.
             * @returns {Function} A function that will create the module.
             */
            defineAs: function(name, path) {

                return function(requiredPaths, moduleFunction) {
                    var requiredModules = [],
                        pathCount = requiredPaths.length,
                        requiredModule,
                        module,
                        i;
                    for (i = 0; i < pathCount; i++) {
                        requiredModule = registeredModules[requiredPaths[i]];
                        requiredModules.push(requiredModule);
                    }
                    module = moduleFunction.apply(this, requiredModules);
                    registeredModules[path] = module;
                    edx[name] = module;
                };
            },

            /**
             * Clears all registered modules.
             *
             * Note: this function is only provided for unit testing.
             */
            clear: function() {
                registeredModules = {};
            }
        };
    })();
}).call(this);
