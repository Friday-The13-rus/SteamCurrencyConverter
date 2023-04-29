import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import WebExtPlugin from 'web-ext-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        exchangeRateStorage: "./src/exchangeRateStorage.ts",
        currencyConverter: "./src/currencyConverter.ts"
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
        clean: true,
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "src/icons/", to: "icons/", },
                {from: "src/manifest.json", to: "manifest.json", },
            ]
        }),
        new WebExtPlugin({ sourceDir: path.join(__dirname, "../dist"), buildPackage: true })
    ],
}