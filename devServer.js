var path                    = require('path');
var webpack                 = require('webpack');
var webpackDevMiddleware    = require('webpack-dev-middleware');
var webpackDevServer        = require('webpack-dev-server');
var Express                 = require('express');
var config                  = require('./webpack.config');
var compiler                = webpack(config);

var app = new Express();
var port = 3000;

config.entry.app.unshift("webpack-dev-server/client?http://localhost:" + port + "/", "webpack/hot/dev-server");



// permet le rechargement des pages sur des url specifié par react-router : TODO : ne permet pas d'utiliser le hot reload!
/*app.use(webpackDevMiddleware(compiler, {
    contentBase: './',
    quiet: false,
    noInfo: false,
    publicPath: config.output.publicPath,
    stats: { colors: true }
}));

app.get('/!*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});*/



// Hot reload :
var server = new webpackDevServer(compiler, {
    hot: true,
    contentBase: './',
    quiet: false,
    noInfo: false,
    publicPath: config.output.publicPath,
    stats: { colors: true }
});

server.listen(port, error => {
    if (error) {
        console.error(error);
    } else {
        console.info('Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
    }
});