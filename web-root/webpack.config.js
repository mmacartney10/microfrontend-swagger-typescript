// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const isProduction = process.env.NODE_ENV === 'production';


const stylesHandler = 'style-loader';



const config = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        port: 3000,
        host: 'localhost',
        historyApiFallback: true,
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'host',
            remotes: {
                'microfrontend': 'microfrontend@http://localhost:3001/remoteEntry.js',
                'microfrontend2': 'microfrontend2@http://localhost:3002/remoteEntry.js',
                'microfrontend3': 'microfrontend3@http://localhost:3003/remoteEntry.js',
            },
            shared: {
                react: { singleton: true },
                'react-dom': { singleton: true },
                'react-router-dom': { singleton: true },
            },
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        },
                    },
                ],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/"),
        },
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
        
    } else {
        config.mode = 'development';
    }
    return config;
};
