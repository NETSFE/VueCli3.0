var glob = require('glob')
const path = require('path');
var vConsolePlugin = require('vconsole-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
function resolve (dir) {
    return path.join(__dirname, dir)
}
function getEntries() {
    let pageEntry = './src/modules/**/*.js'
    if(/\*/.test(pageEntry)) {
        var files = glob.sync(pageEntry)
        var entries = {}
        files.forEach(function(filePath) {
            var dirName = filePath.split('/')
            var name = dirName[dirName.length - 2]
            if (name !== 'apptest') { return }
            entries[name] = {
                'entry': filePath,
                'template': filePath.slice(0, -3) + '.html'
            }
        })
        return entries
    } else {
        return {'index': pageEntry}
    }
}
module.exports = {
    pages: getEntries(),
    baseUrl: './',
    outputDir: process.env.outputDir,
    assetsDir: 'static',
    runtimeCompiler: true,
    configureWebpack: config => {
        config.devtool = process.env.devtool
        if (process.env.NODE_ENV !== 'production') {
            config.plugins.push(
                new vConsolePlugin({enable: true})
            )
        }
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                      compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: false,
                        pure_funcs: ['console.log']
                      }
                    },
                    sourceMap: false,
                    parallel: true
                })
            )
        }
        /* BundleAnalyzerPlugin */
        // if (process.env.NODE_ENV === 'production') {
        //     config.plugins.push(new BundleAnalyzerPlugin())
        // }
    },
    chainWebpack: config => {
        // 引入第三方js
        // script Loader
        config.module
          .rule('vp')
          .test(/\.exec\.js$/)
          .use('script-loader')
            .loader('script-loader')
            .end()
        config.module
            .rule('images')
                .use('url-loader')
                .loader('url-loader')
                .tap(options => Object.assign(options, { limit: 1 }))
        config.resolve.alias
          .set('@assets', resolve('src/assets'))
          .set('@common', resolve('src/common'))
          .set('@components', resolve('src/components'))
          .set('@modules', resolve('src/modules'))
          .set('@routes', resolve('src/routes'))
          .set('@utils', resolve('src/utils'))
          .set('@util', resolve('src/util'))
          .set('@static', resolve('static'))
          .set('@store', resolve('src/store'))
          .set('@mixins', resolve('src/mixins'))
          .set('@plugins', resolve('src/plugins'))
        // config.output.chunkFilename(`[id].[chunkhash:8].js`)
    },
    // pwa: {
    //     name: '平安+PLUS',
    //     themeColor: '#FF5D26',
    //     msTileColor: '#000000',
    //     appleMobileWebAppCapable: 'yes',
    //     appleMobileWebAppStatusBarStyle: 'black',
    //     // configure the workbox plugin
    //     // workboxPluginMode: 'InjectManifest',
    //     workboxOptions: {
    //       runtimeCaching: [{
    //         // Match any same-origin request that contains 'api'.
    //         urlPattern: new RegExp('^https://test-pa18-pweb\.pingan\.com/'),
    //         // Apply a network-first strategy.
    //         handler: 'networkFirst',
    //         // method: 'POST',
    //         options: {
    //           // Fall back to the cache after 10 seconds.
    //           networkTimeoutSeconds: 3,
    //           // Use a custom cache name for this route.
    //           cacheName: 'api-cache',
    //           // Configure custom cache expiration.
    //           expiration: {
    //             maxEntries: 5,
    //             maxAgeSeconds: 60,
    //           },
    //           // Configure which responses are considered cacheable.
    //           cacheableResponse: {
    //             statuses: [0, 200],
    //             // headers: {'x-test': 'true'},
    //           }
    //         }
    //       }]
    //     }
    // }
    // px2rem
    // css: {
    //     extract: true,
    //     // 开启 CSS source maps?
    //     sourceMap: false,
    //     modules: true,
    //     loaderOptions: {
    //         css: {
    //             // options here will be passed to css-loader
    //         },
    //         postcss: {
    //             // options here will be passed to postcss-loader
    //             plugins: [require('postcss-px2rem')({
    //                 remUnit: 37.5
    //             })]
    //         }
    //     }
    // }
}