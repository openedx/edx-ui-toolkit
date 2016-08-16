'use strict';

const childProcess = require('child_process'),
    gitBranchCommand = 'git rev-parse --abbrev-ref HEAD';

module.exports = {
    /**
     * Returns the current Git branch for the current directory.
     */
    currentBranch: () => childProcess.execSync(gitBranchCommand).toString().trim()
};
