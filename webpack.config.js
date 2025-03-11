const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main: {
            import: './src/main.ts',
            filename: 'critters-main.js',
        },
        worker: {
            import: './src/worker.ts',
            filename: 'critters-worker.js',
        },
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'target'),
        library: {
            //name: 'loadCritters',
            type: 'window',
        },
    },
    optimization: {
        minimize: false,
    },
};
