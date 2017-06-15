var path=require('path');
var webpack=require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin"); 
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var proxy=require("http-proxy-middleware");

module.exports={
	devtool: 'eval-source-map',
	entry: {
		index: [
			'webpack-dev-server/client?http://localhost:8181',
			'webpack/hot/only-dev-server',
			'./src/entry.js'
		],
		vendor: ['react', 'jquery']
	},
	output:{
		// path: path.resolve(__dirname,'./build'),
		filename:'bundle.js',
		publicPath: '/'
	},
	devServer: {
		contentBase: "./public",
		inline: true,
		historyApiFallback: true,
		port:8181,
		host: "127.0.0.1",
		proxy: [
			{	
				context: "/*/*", //跨域的路由设置
				target: "http://localhost:3000",  //跨到哪儿去^-^
				changeOrigin: true  //允许跨域，必不可少
			}
		]
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets:['es2015', 'stage-0', 'react'],
					plugins: [
						['import', {libraryName: 'antd', style: 'css'}]
					]
				}
			},
			{
				test: /\.css$/, 
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				})
			},
			{
				test: /\.scss$/, 
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader!sass-loader'
				})
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin('style.css'),
		new CommonsChunkPlugin({
           name: 'vendor',
           filename: 'vendor.js'
        })
	]
}