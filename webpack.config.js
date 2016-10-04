var path        = require('path');
var root        = path.resolve(__dirname);
var webpack     = require('webpack');

module.exports = {
    entry: {
        app: ['./app/index.js']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },

    /** Les loaders **/
    module: {
        loaders: [
            // ES6 :
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                include: root    // on appel le fichier ".babelrc" ici
            }

        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
