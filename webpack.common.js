const path = require('path');

module.exports = {
    mode: 'production',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'docs')
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