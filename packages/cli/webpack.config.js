const path = require("path")
const nodeExternals = require("webpack-node-externals")

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build"),
    },
    target: "node",
    externals: [nodeExternals({
        whitelist: [/^@fnmdx111/, /^moment/, /yargs/, /fetch/, /table/]
    })]
}
