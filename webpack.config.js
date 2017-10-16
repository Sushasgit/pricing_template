const
    path = require('path'),
    webpack = require('webpack'),
    poststylus = require('poststylus'),
    autoprefixer = require('autoprefixer'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin');

const
    src = path.resolve(__dirname, 'src'),
    dest = path.resolve(__dirname, 'dist');

const config = {
    devtool: process.env.NODE_ENV === 'dev' ? 'source-map' : false,

    entry: [
        path.resolve(src, 'common.styl'),
        path.resolve(src, 'index.js')
    ],

    output: {
        path: dest,
        filename: '[hash].bundle.js'
    },

    resolve: {
        modules: [src, 'node_modules']
    },

    devServer: {
        port: 9000,
        contentBase: path.join(__dirname, 'dest'),
        hot: true
    },

    module: {
        rules: [
            {
                test: /\.ttf$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(png|jpeg|jpg|svg)$/,
                loader: 'file-loader?name=images/[name].[ext]'
            },
            {
                test: /\.styl$/, // проходит и при dev-е, и при prod-е
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: process.env.NODE_ENV === 'prod'
                            }
                        },
                        'stylus-loader'
                    ]
                })
            }
        ]
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [poststylus(['autoprefixer', 'rucksack-css'])]
                }
            }
        }),

        new CleanWebpackPlugin(dest, {
            root: __dirname,
            verbose: true
        }),

        new ExtractTextPlugin({
            filename: '[hash].style.min.css',
            allChunks: true,
            disable: process.env.NODE_ENV === 'dev' // создание файла работает только на prod-е
        }),

        new webpack.HotModuleReplacementPlugin(),

        new HtmlWebpackPlugin({
            inject: 'body',
            template: path.resolve(src, 'index.html')
        })
    ]
};

module.exports = config;
