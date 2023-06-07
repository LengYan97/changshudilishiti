/*
 * @Author: your name
 * @Date: 2022-03-28 10:43:19
 * @LastEditTime: 2022-09-26 10:13:20
 * @LastEditors: lengyan
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \地理实体\vue.config.js
 */
const { defineConfig } = require("@vue/cli-service");
const path = require("path");

function resolve(dir) {
	return path.join(__dirname, dir);
}
module.exports = defineConfig({
	publicPath: './',
	transpileDependencies: true,
	//添加hash值，专门解决前端浏览器缓存问题
	filenameHashing: true,
	//eslint语法检查，保存时使用，建议打开
	lintOnSave: false,
	// 是否启用sourceMap，
	// 本地开发建议true，生产版本设置为false。
	// ture会大大增加打包时间，源码也会暴露
	productionSourceMap: false,
	devServer: {
		hot: true,//自动保存
		port: 8080,//默认端口号
		host: "0.0.0.0",
		proxy: "http://222.92.185.58:30000",

		// open: true,//自动启动
	},
	pages: {

		index: {
			// page 的入口
			entry: 'src/main.js',
			title: '地理实体展示系统',
		}
	},
	chainWebpack: config => {
		config.resolve.alias
			.set("@", resolve("src"))
		//   .set("assets", resolve("src/assets"))
		//   .set("components", resolve("src/components"))
		//   .set("base", resolve("baseConfig"))
		//   .set("public", resolve("public"));
	},
	//webpack配置
	configureWebpack: {
		//关闭 webpack 的性能提示
		// performance: {
		//     hints:false
		// },

		//或者

		//警告 webpack 的性能提示
		performance: {
			hints: 'warning',
			//入口起点的最大体积
			maxEntrypointSize: 50000000,
			//生成文件的最大体积
			maxAssetSize: 30000000,
			//只给出 js 文件的性能提示
			assetFilter: function (assetFilename) {
				return assetFilename.endsWith('.js');
			}
		}
	}

});
