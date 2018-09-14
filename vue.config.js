const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const isServer = process.env.WEBPACK_TARGET === 'node';

module.exports = {
    configureWebpack: () => ({
        entry: `./src/entry-${ isServer ? 'server' : 'client' }.js`,
        target: isServer ? 'node' : 'web',
        node: isServer ? undefined : false,
        devtool: 'source-map',
        plugins: [
            isServer ? new VueSSRServerPlugin() : new VueSSRClientPlugin()
        ],
        externals: isServer ? nodeExternals({ whitelist: /\.css$/ }) : undefined,
        output: {
            libraryTarget: isServer ? 'commonjs2' : undefined
        }
    }),
    chainWebpack: config => {
        config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
            merge(options, {
                optimizeSSR: false
            })
        })

    },
    productionSourceMap: false,
}