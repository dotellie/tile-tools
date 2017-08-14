import rollupBabel from "rollup-plugin-babel";

const pkg = require("./package.json");

export default {
    entry: "src/index.js",
    plugins: [
        rollupBabel()
    ],
    targets: [
        {
            dest: pkg.main,
            format: "umd",
            moduleName: "dtileTilemap",
            sourceMap: true
        },
        {
            dest: pkg.module,
            format: "es",
            sourceMap: true
        }
    ]
};
