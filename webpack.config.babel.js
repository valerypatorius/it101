import { resolve } from 'path';
import { HotModuleReplacementPlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import Autoprefixer from 'autoprefixer';
import Cssnano from 'cssnano';

import Config from './src/config';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const OUTPUT = {
    js: 'app.js',
    css: 'app.css',
};

/**
 * Dev server options
 */
const devServer = {
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    hot: true,
    clientLogLevel: 'error',
};

/**
 * Plugins list
 */
const plugins = [
    new MiniCssExtractPlugin({
        filename: OUTPUT.css,
    }),
];

if (!IS_PRODUCTION) {
    plugins.push(...[
        new HotModuleReplacementPlugin(),
    ]);
}

export default {
    mode: IS_PRODUCTION ? 'production' : 'development',
    devServer,
    entry: './src/index.js',
    output: {
        path: resolve(__dirname, './'),
        filename: OUTPUT.js,
        library: Config.name,
        libraryExport: 'default',
        // libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: !IS_PRODUCTION,
                            reloadAll: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: [
                                Autoprefixer,
                                Cssnano,
                            ],
                        },
                    },
                    {
                        loader: 'stylus-loader',
                    },
                ],
            },
        ],
    },
    watch: !IS_PRODUCTION,
    plugins,
};
