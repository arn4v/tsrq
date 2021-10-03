// Credits: https://github.com/VirtusLab-Open-Source/formts/blob/master/tsdx.config.js
// see: https://github.com/formium/tsdx#rollup
// TODO: track https://github.com/formium/tsdx/issues/961 for possible better solution

const path = require("path");

const relativePath = p => path.join(__dirname, p);

module.exports = {
	rollup(config, options) {
		return {
			...config,
			input: [
				relativePath("src/index.ts"),
				relativePath("src/react-query/index.ts"),
			],
			output: {
				...config.output,
				file: undefined,
				dir: relativePath("dist"),
				preserveModules: true,
				preserveModulesRoot: relativePath("src"),
			},
		};
	},
};
