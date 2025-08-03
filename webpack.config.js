const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: "./src/main.js",
    },
    mode: 'development',
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 3000,
    },
    output: {
        filename: 'bundle.js',
        chunkFilename: 'worker.bundle.js', // 控制动态导入、Web Worker 等模块的文件名
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    experiments: {
        asyncWebAssembly: true,
        topLevelAwait: true, // Required for ffmpeg.wasm
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            chunks: ["main"]
        }),
    ],
    resolve: {
        extensions: ['.js'],
        fallback: {
            fs: false,
            path: false,
            crypto: false,
        },
    },
    ignoreWarnings: [
        {
            module: /@ffmpeg\/ffmpeg/,
           
        },
    ],
};
