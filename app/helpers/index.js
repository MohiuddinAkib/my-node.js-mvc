const path = require('path');

exports.ROOTPATH = path.dirname(path.dirname(__dirname));
exports.PUBLICPATH = path.join(path.dirname(path.dirname(__dirname)), 'public');
exports.APPPATH = path.join(path.dirname(path.dirname(__dirname)), 'app');
