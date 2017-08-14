import rollupBabel from "rollup-plugin-babel";

const pkg = require("./package.json");

export default {
    entry: "src/index.js",
    plugins: [
        rollupBabel({
            babelrc: false,
            presets: [
                ["env", { modules: false }],
                "stage-3"
            ]
        })
    ],
    targets: [
        {
            dest: pkg.main,
            format: "umd",
            moduleName: "TileTools",
            sourceMap: true
        },
        {
            dest: pkg.module,
            format: "es",
            sourceMap: true
        }
    ]
};
