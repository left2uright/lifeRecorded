const path = require('path');

module.exports = {
    entry: './public/js/index.js',
    output: {
        filename: 'lr.js',
        path: path.resolve(__dirname, 'public/js')
    },

    devtool: 'inline-source-map'
};
