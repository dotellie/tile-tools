const pkg = require("./package.json");

export default {
	entry: "src/index.js",
	targets: [
		{
			dest: pkg.main,
			format: "umd",
			moduleName: "dtileTilemap",
			sourceMap: true
		},
		{
			dest: pkg["jsnext:main"],
			format: "es",
			sourceMap: true
		}
	]
};
