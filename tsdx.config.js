module.exports = {
	rollup(config, options) {
		options.format = "esm";
		return config;
	},
};
