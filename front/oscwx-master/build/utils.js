var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function(_path) {
	return path.posix.join(config.build.assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
	options = options || {}
	// generate loader string to be used with extract text plugin
	function generateLoaders(loaders) {
		var sourceLoader = loaders.map(function(loader) {
			var extraParamChar
			if(/\?/.test(loader)) {
				loader = loader.replace(/\?/, '-loader?')
				extraParamChar = '&'
			} else {
				loader = loader + '-loader'
				extraParamChar = '?'
			}
			return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
		}).join('!')

		if(options.extract) {
			return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
		} else {
			return ['vue-style-loader', sourceLoader].join('!')
		}
	}

	// http://vuejs.github.io/vue-loader/configurations/extract-css.html
	const REM_UNIT = 16;
	let px2rem = `px2rem?remUnit=${REM_UNIT}&remPrecision=4`;
	return {
		css: generateLoaders(['css', px2rem]),
		postcss: generateLoaders(['css', px2rem]),
		less: generateLoaders(['css', px2rem, 'less']),
		sass: generateLoaders(['css', px2rem, 'sass?indentedSyntax']),
		scss: generateLoaders(['css', px2rem, 'sass']),
		stylus: generateLoaders(['css', px2rem, 'stylus']),
		styl: generateLoaders(['css', px2rem, 'stylus'])
	}
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
	var output = []
	var loaders = exports.cssLoaders(options)
	for(var extension in loaders) {
		var loader = loaders[extension]
		output.push({
			test: new RegExp('\\.' + extension + '$'),
			loader: loader
		})
	}
	return output
}