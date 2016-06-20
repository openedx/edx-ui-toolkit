var childProcess = require('child_process');

(function() {
    'use strict';

    var gitBranchCommand = 'git rev-parse --abbrev-ref HEAD';

    module.exports = {
        /**
         * Returns the current Git branch for the current directory.
         */
        currentBranch: function() {
            var branch = childProcess.execSync(gitBranchCommand);
            return branch.toString().trim();
        }
    };
}());
