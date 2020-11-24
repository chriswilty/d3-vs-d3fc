const path = require('path');

module.exports = {
    mode: 'production',
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    resolve: {
        alias: {
            'src': __dirname + '/src',
        }
    }
};