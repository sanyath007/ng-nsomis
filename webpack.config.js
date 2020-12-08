var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: path.resolve(__dirname, "app"),
    entry: {
        app: './app.js'
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ]
};
