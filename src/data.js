const fs = require('fs');

const doesExist = (path) => {
    if (fs.existsSync(path)) {
        return true;
    }
    return false;
}

const makeDir = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

exports.doesExist = doesExist;
exports.makeDir = makeDir;